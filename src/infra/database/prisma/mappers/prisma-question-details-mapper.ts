import {
    Question as PrismaQuestion,
    User as PrismaUser,
    Attachment as PrismaAttachment,
  } from '@prisma/client'
  import { UniqueEntityID } from '@/core/entities/unique-entity-id'
  import { PrismaAttachmentMapper } from './prisma-attachment-mapper'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objetcs/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objetcs/slug'
  
  type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
  }
  
  export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
      return QuestionDetails.create({
        questionId: new UniqueEntityID(raw.id),
        authorId: new UniqueEntityID(raw.author.id),
        author: raw.author.name,
        title: raw.title,
        slug: Slug.create(raw.slug),
        attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      })
    }
  }