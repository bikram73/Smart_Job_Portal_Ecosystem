import { PrismaClient, JobPosting } from '@prisma/client';

const prisma = new PrismaClient();

interface RawJobPayload {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
}

export class JobIngestionService {
  
  /**
   * FR-101: Scheduled job ingestion from configured sources
   * FR-102: Parse and normalize into canonical schema
   */
  async ingestJobs(payloads: RawJobPayload[]): Promise<void> {
    console.log(`Starting ingestion for ${payloads.length} jobs...`);

    for (const payload of payloads) {
      try {
        // FR-102: Normalization
        const normalizedJob = this.normalizePayload(payload);

        // FR-103: Duplicate detection
        const isDuplicate = await this.checkDuplicate(normalizedJob.sourceUrl);
        
        if (!isDuplicate) {
          await prisma.jobPosting.create({
            data: normalizedJob
          });
          console.log(`Ingested: ${normalizedJob.title} at ${normalizedJob.company}`);
        } else {
          console.log(`Skipped Duplicate: ${normalizedJob.sourceUrl}`);
        }
      } catch (error) {
        console.error(`Failed to ingest job ${payload.url}`, error);
        // NFR-005: Dead-letter handling logic would go here
      }
    }
  }

  private normalizePayload(raw: RawJobPayload): Omit<JobPosting, 'id' | 'createdAt' | 'recencyScore'> {
    // Basic text extraction and cleaning
    return {
      title: raw.title.trim(),
      company: raw.company.trim(),
      location: raw.location.trim(),
      description: raw.description, // In real impl, sanitize HTML here
      sourceUrl: raw.url,
      postedAt: new Date(raw.postedDate),
      skills: this.extractSkills(raw.description),
      matches: undefined // Relation field
    };
  }

  /**
   * FR-103: Duplicate detection with source checks
   */
  private async checkDuplicate(url: string): Promise<boolean> {
    const existing = await prisma.jobPosting.findUnique({
      where: { sourceUrl: url }
    });
    return !!existing;
  }

  /**
   * Helper for FR-104 (Relevance scoring preparation)
   */
  private extractSkills(description: string): string[] {
    // Placeholder for NLP/Regex skill extraction
    const commonSkills = ['Java', 'Python', 'React', 'SQL', 'AWS'];
    const foundSkills: string[] = [];
    
    commonSkills.forEach(skill => {
      if (description.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    return foundSkills;
  }
}