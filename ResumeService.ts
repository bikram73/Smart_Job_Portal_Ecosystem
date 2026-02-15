import { PrismaClient, Resume, ATSAssessment } from '@prisma/client';

const prisma = new PrismaClient();

export class ResumeService {

  /**
   * FR-304: ATS score and improvement recommendations
   */
  async analyzeResume(resumeId: string): Promise<ATSAssessment> {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { profile: true }
    });

    if (!resume) throw new Error('Resume not found');

    // Simulate AI Analysis
    const analysisResult = this.mockAIAnalysis(resume);

    // Save Assessment
    const assessment = await prisma.aTSAssessment.create({
      data: {
        resumeId: resume.id,
        score: analysisResult.score,
        feedback: analysisResult.feedback
      }
    });

    // Update Resume with latest score
    await prisma.resume.update({
      where: { id: resumeId },
      data: { atsScore: analysisResult.score }
    });

    return assessment;
  }

  /**
   * FR-305: Job-aware resume customization suggestions
   */
  async tailorResumeForJob(resumeId: string, jobDescription: string): Promise<string[]> {
    // Logic to compare resume keywords vs JD keywords
    // Returns list of suggestions
    return [
      "Add 'Microservices' to your Skills section based on the JD.",
      "Quantify your experience in the 'Backend Developer' role."
    ];
  }

  private mockAIAnalysis(resume: Resume): { score: number; feedback: string } {
    // This would be replaced by an LLM call (OpenAI/Gemini)
    const contentStr = JSON.stringify(resume.content);
    let score = 50;
    const feedback = [];

    if (contentStr.length > 500) score += 20;
    if (resume.title) score += 10;
    
    feedback.push("Ensure you use standard section headers.");
    feedback.push("Use bullet points for readability.");

    return {
      score: Math.min(score, 100),
      feedback: feedback.join(' ')
    };
  }
}