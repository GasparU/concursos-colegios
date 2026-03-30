import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Injectable()
export class ExamsService {
  private deepseekApiKey: string;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("❌ ERROR: Falta DEEPSEEK_API_KEY en el .env");
      throw new Error("Falta DEEPSEEK_API_KEY");
    }
    this.deepseekApiKey = apiKey;
  }

  // --- 🤖 IA: DEEPSEEK CHAT (CERO ALUCINACIONES, CERO LÍMITES) ---
  async getAIDidacticExplanation(questionMarkdown: string, correctAnswer: string, options: any, category: string = 'MATH', userAnswerKey: string = '') {

    const userAnswerText = options[userAnswerKey] || userAnswerKey;
    const correctAnswerText = options[correctAnswer] || correctAnswer;

    const promptMath = `
      Actúa como profesor de la academia Ariana para CONAMAT.
      El estudiante marcó la opción incorrecta: ${userAnswerText}
      La respuesta correcta es: ${correctAnswerText}
      
      REGLAS ESTRICTAS:
      1. NO saludes ni expliques tu razonamiento.
      2. Ve DIRECTO AL GRANO en máximo 3 pasos cortos.
      3. Usa LaTeX $...$ para toda la matemática.
      4. Termina con un "Truco:" de 1 sola línea si es posible.
      
      Problema: ${questionMarkdown}
    `;

    const promptLetras = `
      Actúa como un Mentor de Letras muy humano, cálido y pedagógico para una niña de 11 años llamada Ariana.
      
      CONTEXTO:
      - Ariana marcó la opción equivocada: ${userAnswerText}
      - La respuesta correcta es: ${correctAnswerText}

      REGLAS DE ORO ESTRICTAS:
      1. TEXTO PLANO ABSOLUTO: PROHIBIDO usar asteriscos (**), PROHIBIDO usar signos de dólar ($), y PROHIBIDO usar etiquetas como [COL]. Escribe texto normal, limpio y directo. Si necesitas resaltar una palabra, escríbela en MAYÚSCULAS.
      2. SÉ BREVE Y DIDÁCTICO: Explica como un buen profesor, sin párrafos inmensos ni rodeos. Ve al grano.
      3. SÉ HUMANO Y FLEXIBLE: Varía tu forma de empezar. Usa frases naturales como "¡Casi, Ariana!", "¡Por poco!" "Esta era una trampita común...", "Buena lógica, pero fíjate en este detalle...". NO uses siempre la misma frase introductoria.
      4. ESTRUCTURA CORTA:
         - El error: Explica rápido y con cariño por qué la opción ${userAnswerText} engañaba.
         - La verdad: Explica por qué ${correctAnswerText} es la correcta de forma sencilla.
         - Ejemplos: Da 2 ejemplos muy cortitos y fáciles para que fije la regla.
      
      Problema original: ${questionMarkdown}
    `;

    const isLetras = /comunic|lenguaj|verbal|lect|historia|sociales|analog|sinonim|antonim|semantica/i.test(category);
    const finalPrompt = isLetras ? promptLetras : promptMath;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat", 
          messages: [{ role: "user", content: finalPrompt }],
          temperature: 0.3 
        })
      });

      if (!response.ok) throw new Error("Fallo en DeepSeek");

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error("❌ Error ejecutando DeepSeek:", error);
      return isLetras 
        ? "¡Uy! Esta pregunta fue todo un reto. Revisa bien la relación principal entre las palabras. ¡Tú puedes, Ariana!" 
        : "Aplica la propiedad principal y simplifica directamente. ¡Tú puedes!";
    }
  }

  // 🔥 FUNCIÓN PRIVADA QUE TRABAJA EN LA SOMBRA
  private async processAIInBackground(failedQuestions: any[], examCategory: string = 'MATH') {
    for (const q of failedQuestions) {
      const isDefault = !q.solutionMarkdown || 
                         q.solutionMarkdown.length < 50 || 
                         q.solutionMarkdown.includes("No hay solución") ||
                         q.solutionMarkdown.includes("Aplica la propiedad principal");

      if (isDefault) {
        console.log(`🧠 [BACKGROUND] Mentor analizando error en pregunta: ${q.id}`);
        // 🔥 PASAMOS LA RESPUESTA DE ARIANA AL MENTOR
        const aiSolution = await this.getAIDidacticExplanation(q.questionMarkdown, q.correctAnswer, q.options, examCategory, q.userAnswerKey);
        
        await this.prisma.question.update({
          where: { id: q.id },
          data: { solutionMarkdown: aiSolution }
        });
      }
    }
  }

  async submitExam(examId: string, studentId: string,  dto: SubmitExamDto) {
    // 🛡️ Extraemos con seguridad. Si algo no viene, ponemos {}
    const answers = dto.answers || {};
    const timings = dto.timings || {};
    
    const timeUsedSeconds = dto.timeUsedSeconds || 0;
    const idealTimeSeconds = dto.idealTimeSeconds || 0;

    // 🔥 DEBUG: Mira tu terminal negra cuando Ariana termine. Verás esto:
    console.log("📥 DATOS RECIBIDOS EN EL SERVER:", { answers, timings });

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: { orderBy: { order: 'asc' } } }, 
    });

    if (!exam) throw new NotFoundException('Examen no encontrado');

    let score = 0;
    const failedQuestions: any[] = [];
    
    const total = exam.questions.length;
    const limitBasico = Math.floor(total * 0.30);     
    const limitIntermedio = Math.floor(total * 0.60); 
    

    const details: any = {
      basico: { correct: 0, total: 0, totalTime: 0 },
      intermedio: { correct: 0, total: 0, totalTime: 0 },
      avanzado: { correct: 0, total: 0, totalTime: 0 }
    };

    exam.questions.forEach((q, index) => {
            
      let nivel: 'basico' | 'intermedio' | 'avanzado' = 'basico';
      
      if (index < limitBasico) {
        nivel = 'basico';
      } else if (index < limitIntermedio) {
        nivel = 'intermedio';
      } else {
        // Todo lo que está del 60% al 100% es avanzado (el 40% restante)
        nivel = 'avanzado';
      }

      details[nivel].total++;
      
      // 🔥 PROTECCIÓN ANTI-CRASH: Si no hay tiempo para este ID, usamos 0
      const timeSpent = timings[q.id] || 0;
      details[nivel].totalTime += Number(timeSpent);

      // 🔥 COMPARACIÓN ULTRA-SEGURA
      const userAns = String(answers[q.id] || "").trim().toUpperCase();
      const correctAns = String(q.correctAnswer || "").trim().toUpperCase();

      // Si el ID coincide y la letra es igual, es punto
      if (userAns === correctAns && userAns !== "") {
        score++;
        details[nivel].correct++; 
      } else {
        // 🔥 FIX QUIRÚRGICO: Guardamos qué alternativa marcó exactamente la alumna
        failedQuestions.push({ ...q, userAnswerKey: userAns });
      }
    });

    const finalDetails = {};
    Object.keys(details).forEach(key => {
      const d = details[key];
      const avg = d.total > 0 ? Math.round(d.totalTime / d.total) : 0;
      finalDetails[key] = {
        correct: d.correct,
        total: d.total,
        avgTimeStr: `${avg}s / preg` 
      };
    });

    const savedResult = await this.prisma.examResult.create({
      data: {
        examId,
        studentId,
        score,
        total,
        answers,
        startTime: new Date(),
        endTime: new Date(),
        timeUsedSeconds,
        idealTimeSeconds,
        details: finalDetails 
      },
    });

    const examCategory = exam.title || 'MATH';

    // Procesamos IA solo para las falladas
    this.processAIInBackground(failedQuestions, examCategory).catch(err => 
      console.error("Error en proceso IA de fondo:", err)
    );

    return savedResult;
  }

  // --- 📊 RESULTADOS: AVISA SI LA IA AÚN ESTÁ PENSANDO ---
  async getResult(examId: string, userId: string) {
    const result = await this.prisma.examResult.findFirst({
      where: { examId, studentId: userId },
      include: { 
        exam: { 
          include: { questions: { orderBy: { order: 'asc' } } } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!result) throw new NotFoundException('No se encontró el resultado.');

    // 💉 VACUNA 2: Forzamos el tipado para que TS no llore por el null de Prisma
    const safeAnswers = (result.answers as Record<string, string>) || {};

    // 🔥 VERIFICADOR DE ESTADO: ¿La IA ya analizó todos los errores?
    let isProcessing = false;
    for (const q of result.exam.questions) {
      const userAnsKey = safeAnswers[q.id]; // Ahora lee del objeto seguro
      
      if (userAnsKey !== q.correctAnswer) {
        const sol = q.solutionMarkdown || "";
        // Si hay una pregunta fallada que aún tiene el texto por defecto, la IA sigue trabajando
        if (sol.length < 20 || sol.includes("No hay solución")) {
          isProcessing = true;
          break;
        }
      }
    }

    // Si sigue procesando, mandamos una bandera al frontend
    if (isProcessing) {
      return { processing: true };
    }

    return {
      processing: false,
      score: result.score,
      total: result.total,
      answers: safeAnswers, // Mandamos el objeto limpio
      questions: result.exam.questions 
    };
  }

  async findAllForStudent(userId: string) {
    // 🔥 1. VALLA DE SEGURIDAD
    if (!userId || userId === 'undefined') {
      console.error("⚠️ findAllForStudent: El userId llegó vacío o es undefined. Revisa el Controller.");
      return []; 
    }

    try {
      // 2. Buscamos quién pide la info
      const requester = await this.prisma.user.findUnique({ where: { id: userId } });
      
      if (!requester) {
        console.error(`⚠️ Usuario con ID ${userId} no existe en la base de datos.`);
        return [];
      }

      let targetStudentId = userId;

      // 4. Lógica Automática Docente -> Estudiante
      if (requester.role === 'DOCENTE') {
        const student = await this.prisma.user.findFirst({
          where: { role: 'ESTUDIANTE' }
        });
        if (student) {
          targetStudentId = student.id;
        } else {
          console.warn("⚠️ Eres docente pero no hay ningún ESTUDIANTE registrado.");
        }
      }

      // 5. Traemos los exámenes
      const exams = await this.prisma.exam.findMany({
        include: {
          examResults: {
            where: { studentId: targetStudentId },
            orderBy: { createdAt: 'desc' },
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      // 6. Mapeamos
      return exams.map(exam => {
        const results = exam.examResults || [];
        const lastResult = results[0] || null;

        return {
          ...exam,
          isCompleted: !!lastResult,
          score: lastResult?.score ?? 0,
          totalQuestions: exam.questionsCount || 0,
          dateCompleted: lastResult?.endTime ?? null,
          studentScore: lastResult?.score,
          details: lastResult?.details || null, 
          examResults: results 
        };
      });
    } catch (error) {
      // 🔥 CAMBIO QUIRÚRGICO VITAL:
      console.error("❌ Error crítico en findAllForStudent:", error);
      // En vez de 'throw new Error' que rompe React con un 500, devolvemos un array vacío [].
      // Así la app carga visualmente, y tú puedes ver el error real en tu consola negra.
      return []; 
    }
  }

  async create(data: any, userId: string) {
    const { questions, category, ...examData } = data;  

    const textoCategoria = String(category || examData.type || examData.title).toUpperCase();
    const isLetrasCategory = ['COMUNICACION', 'LENGUAJE', 'RAZONAMIENTO_VERBAL', 'HISTORIA'].includes(String(examData.category || examData.type).toUpperCase());

    // 🔥 CONFIGURACIÓN DE ESCALERA
    const P_BASICO = 0.30; 
    const P_INTERMEDIO = 0.30;
    const P_AVANZADO = 0.40

    const total = questions.length;
    const cantBasico = Math.floor(total * P_BASICO);
    const cantIntermedio = Math.floor(total * P_INTERMEDIO);
    const cantAvanzado = Math.floor(total * P_AVANZADO)

    const isStandard = ['TAREA', 'CLASE', 'SIMULACRO'].includes(examData.type);
    
    // 🔥 ORDENAMIENTO REAL: Usamos el campo 'difficulty' que ahora sí envía el frontend
    const sortedQuestions = [...questions]
      .filter(q => !(isStandard && (q.difficulty === 'experto' || q.dificultad?.includes('experto'))))
      .sort((a, b) => {
        const pesos: Record<string, number> = { 'basico': 1, 'intermedio': 2, 'avanzado': 3, 'experto': 4 };
        const pesoA = pesos[a.difficulty || a.dificultad?.[0]] || 1;
        const pesoB = pesos[b.difficulty || b.dificultad?.[0]] || 1;
        return pesoA - pesoB;
      });

      

    return this.prisma.exam.create({
      data: {
        ...examData,
        title: examData.title || 'Sin título',
        questionsCount: sortedQuestions.length,
        docenteId: userId,
        questions: {
          create: sortedQuestions.map((q: any, index: number) => {
           let color = "emerald"; 
            if (index < cantBasico) {
                color = "emerald";
            } 
            else if (index < (cantBasico + cantIntermedio)) {
                color = "amber";
            } 
            else if (index < (cantBasico + cantIntermedio + cantAvanzado)) {
                color = "rose";
            }
            else {
                color = "violet";
            }
            if (q.difficulty === 'experto' || q.dificultad?.includes('experto')) {
                color = "violet";
            }
            const vData = q.visual_data || q.visualData || {};
            const cleanMath = (text: string) => {
              if (!text || isLetrasCategory) return text;
              return text
                // 1. Limpia "1n^2" -> "n^2" (Guarda lo que haya antes en el $1)
                .replace(/(^|[^\d])1n\^2/g, '$1n^2')
                
                // 2. Limpia "1n" -> "n" (Protegiendo el 11n, 21n con Lookahead negativo)
                .replace(/(^|[^\d])1n(?!\d)/g, '$1n')
                
                // 3. Aniquila " + 0n" o " - 0n" (Como en tu opción C)
                .replace(/\s*[+-]\s*0n(?!\d)/g, '')
                
                // 4. Aniquila "0n^2 + " (Por si la IA genera A=0)
                .replace(/(^|[^\d])0n\^2\s*[+-]\s*/g, '$1');
            };

            const cleanOptions = {};
            Object.entries(q.options || {}).forEach(([key, value]) => {
              cleanOptions[key] = cleanMath(String(value));
            });

            return {
              order: index + 1,
              questionMarkdown: cleanMath(q.question_markdown || q.questionMarkdown || ''),
              options: cleanOptions, // Usamos las opciones limpias
              correctAnswer: cleanMath(String(q.correct_answer || q.correctAnswer || '')),
              solutionMarkdown: cleanMath(q.solution_markdown || q.solutionMarkdown || 'No hay solución detallada.'),
              hint: q.hint || null,
              mathData: q.math_data || q.mathData || {},
              visualData: { ...vData, difficultyColor: color },
            };
          }),
        },
      },
      include: { questions: true },
    });
  }

  async findOne(id: string) {
    // 🔥 ESCUDO: Evita que Prisma explote si React envía "undefined" como string
    if (!id || id === 'undefined' || id === 'null') {
      throw new NotFoundException('Examen no válido');
    }

    try {
      const exam = await this.prisma.exam.findUnique({
        where: { id },
        include: { questions: { orderBy: { order: 'asc' } } },
      });
      if (!exam) throw new NotFoundException('Examen no encontrado');
      return exam;
    } catch (error) {
      console.error(`❌ Error en findOne (ID: ${id}):`, error);
      throw new NotFoundException('Error al cargar examen'); // 404 en vez de 500
    }
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkResultExists(examId: string, userId: string) {
    // 🔥 ESCUDO: Protegemos contra IDs fantasmas
    if (!examId || examId === 'undefined' || !userId || userId === 'undefined') {
      return false;
    }

    try {
      const result = await this.prisma.examResult.findFirst({
        where: { examId, studentId: userId },
      });
      return !!result;
    } catch (error) {
      console.error("❌ Error en checkResultExists:", error);
      return false; // Si falla, asumimos false para no romper la UI
    }
  }


  // --- 🗑️ ELIMINAR EXAMEN (LIMPIEZA TOTAL) ---
  async remove(id: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException('Examen no encontrado');

    // 1. Borramos los resultados asociados (para no dejar respuestas huérfanas)
    await this.prisma.examResult.deleteMany({ where: { examId: id } });
    
    // 2. Borramos las preguntas del examen
    await this.prisma.question.deleteMany({ where: { examId: id } });
    
    // 3. Finalmente borramos el examen (deleteMany evita el error si ya no existe)
    return this.prisma.exam.deleteMany({ where: { id } });
  }


}