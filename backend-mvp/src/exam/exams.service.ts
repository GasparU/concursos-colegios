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

  // --- 🚀 SUBMIT: EVALÚA Y GENERA IA AL INSTANTE ---
  async submitExam(examId: string, studentId: string, answers: any) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) throw new NotFoundException('Examen no encontrado');

    let score = 0;
    const failedQuestions: any[] = [];

    // 1. Calificamos a la velocidad de la luz
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      } else {
        failedQuestions.push(q);
      }
    });

    // 2. Guardamos el resultado en la BD ¡AL INSTANTE! (0.1 segundos)
    const savedResult = await this.prisma.examResult.create({
      data: {
        examId,
        studentId,
        score,
        total: exam.questions.length,
        answers,
        startTime: new Date(),
        endTime: new Date(),
      },
    });

    // 3. 🔥 FIRE AND FORGET: Disparamos la IA en segundo plano SIN AWAIT
    this.processAIInBackground(failedQuestions).catch(err => 
      console.error("Error en proceso IA de fondo:", err)
    );

    // 4. Respondemos al frontend inmediatamente
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

  // --- 📝 LISTADO PARA ALUMNOS ---
  async findAllForStudent(userId: string) {
    const exams = await this.prisma.exam.findMany({
      include: {
        examResults: {
          where: { studentId: userId },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return exams.map(exam => ({
      ...exam,
      // @ts-ignore
      isCompleted: (exam.examResults?.length || 0) > 0 
    }));
  }

  // --- 🛠️ MÉTODOS CRUD ---
  async create(data: any, userId: string) {
    const { questions, ...examData } = data;

    return this.prisma.exam.create({
      data: {
        title: examData.title || 'Sin título',
        type: examData.type,
        grade: examData.grade,
        stage: examData.stage,
        difficulty: examData.difficulty,
        questionsCount: questions.length,
        deadline: examData.deadline,
        durationMinutes: examData.durationMinutes,
        docenteId: userId,
        questions: {
          create: questions.map((q: any, index: number) => ({
            order: index + 1,
            questionMarkdown: q.question_markdown || q.questionMarkdown || '',
            options: q.options || {},
            correctAnswer: String(q.correct_answer || q.correctAnswer || ''),
            solutionMarkdown: q.solution_markdown || q.solutionMarkdown || 'No hay solución detallada.',
            hint: q.hint || null,
            mathData: q.math_data || q.mathData || {},
            visualData: q.visual_data || q.visualData || {},
          })),
        },
      },
      include: { questions: true },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    return exam;
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkResultExists(examId: string, userId: string) {
    const result = await this.prisma.examResult.findFirst({
      where: { examId, studentId: userId },
    });
    return !!result;
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