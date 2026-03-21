import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  async getAIDidacticExplanation(questionMarkdown: string, correctAnswer: string, options: any) {
    const prompt = `
      Actúa como profesor de la academia Atiana para CONAMAT.
      
      REGLAS ESTRICTAS E INQUEBRANTABLES:
      1. NO saludes.
      2. NO expliques tu razonamiento interno ("Analizando...").
      3. Ve DIRECTO AL GRANO en máximo 3 pasos muy cortos.
      4. Usa LaTeX $...$ para toda la matemática.
      5. Termina con un "Truco:" de 1 sola línea si es posible.
      6. Puedes darlo en "paso 1, paso 2, paso 3". Pero no más de 6 pasos ni tantas lineas, es matematica, no te va a leer explicaciones, solo pasos directos.
      7. Si usas palabras con tildes o la letra Ñ dentro de LaTeX $...$, DEBES envolverlas en \\text{...}. Ejemplo: $t_{\\text{término}}$ en lugar de $t_{término}$.

      Problema: ${questionMarkdown}
      Opciones: ${JSON.stringify(options)}
      Clave Correcta: ${correctAnswer}
    `;

    try {
      // Llamada nativa a la API de DeepSeek
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat", // Usamos el modelo rápido y estable
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2 // Muy bajo para que no alucine nada
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error de la API DeepSeek:", errorText);
        throw new Error("Fallo en DeepSeek");
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error("❌ Error ejecutando DeepSeek:", error);
      return "Aplica la propiedad principal y simplifica directamente. ¡Tú puedes!";
    }
  }

  // 🔥 FUNCIÓN PRIVADA QUE TRABAJA EN LA SOMBRA
  private async processAIInBackground(failedQuestions: any[]) {
    for (const q of failedQuestions) {
      const isDefault = !q.solutionMarkdown || 
                         q.solutionMarkdown.length < 20 || 
                         q.solutionMarkdown.includes("No hay solución");

      if (isDefault) {
        console.log(`🧠 [BACKGROUND] DeepSeek analizando pregunta: ${q.id}`);
        // Asumo que sigues usando la función getAIDidacticExplanation de DeepSeek
        const aiSolution = await this.getAIDidacticExplanation(q.questionMarkdown, q.correctAnswer, q.options);
        
        await this.prisma.question.update({
          where: { id: q.id },
          data: { solutionMarkdown: aiSolution }
        });
      }
    }
  }

  async submitExam(examId: string, studentId: string, payload: any) {
    // 🛡️ Extraemos con seguridad. Si algo no viene, ponemos {}
    const answers = payload?.answers || {};
    const timings = payload?.timings || {};
    
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
    const limitBasico = Math.floor(total * 0.30);     // 30% inicial
    const limitIntermedio = Math.floor(total * 0.60); // 30% + 30% = 60%
    

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
        failedQuestions.push(q);
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
        details: finalDetails 
      },
    });

    // Procesamos IA solo para las falladas
    this.processAIInBackground(failedQuestions).catch(err => 
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
    const { questions, ...examData } = data;

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
            // 🔥 ASIGNACIÓN DE COLORES BASADA EN LA POSICIÓN DE LA ESCALERA
           let color = "emerald"; 
            
            // Si el índice está en el primer 20%
            if (index < cantBasico) {
                color = "emerald";
            } 
            // Si está entre el 20% y el 50% (20+30)
            else if (index < (cantBasico + cantIntermedio)) {
                color = "amber";
            } 
            // Si está entre el 50% y el 80% (20+30+30)
            else if (index < (cantBasico + cantIntermedio + cantAvanzado)) {
                color = "rose";
            }
            // El resto es Violeta
            else {
                color = "violet";
            }

            // Forzado por etiqueta manual (mantiene consistencia con lo que ya tenías)
            if (q.difficulty === 'experto' || q.dificultad?.includes('experto')) {
                color = "violet";
            }

            // 🛡️ Aseguramos que visualData sea un objeto para meter el color
            const vData = q.visual_data || q.visualData || {};

            // 🔥 REEMPLAZA TU cleanMath POR ESTA VERSIÓN BLINDADA
            const cleanMath = (text: string) => {
              if (!text) return text;
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
    
    // 3. Finalmente borramos el examen
    return this.prisma.exam.delete({ where: { id } });
  }


}