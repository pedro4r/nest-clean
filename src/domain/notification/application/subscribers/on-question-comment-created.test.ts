import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
    SendNotificationUseCase,
    SendNotificationUseCaseRequest,
    SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { OnQuestionCommentCreated } from './on-question-comment-created'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sendNotificationExecuteSpy: SpyInstance<
    [SendNotificationUseCaseRequest],
    Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()

            inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
                inMemoryQuestionAttachmentsRepository,
                inMemoryAttachmentsRepository,
                inMemoryStudentsRepository,
              )

        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository(
                inMemoryStudentsRepository,
            )

        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository
        )

        sendNotificationExecuteSpy = vi.spyOn(
            sendNotificationUseCase,
            'execute'
        )

        new OnQuestionCommentCreated(
            inMemoryQuestionsRepository,
            sendNotificationUseCase
        )
    })

    it('should  send a notification when a comment in question is created', async () => {
        const question = makeQuestion()
        const questionComment = makeQuestionComment({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryQuestionCommentsRepository.create(questionComment)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})
