import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'

export class OnAnswerCommentCreated implements EventHandler {
    constructor(
        private answerRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerCommentNotification.bind(this),
            AnswerCommentCreatedEvent.name
        )
    }

    private async sendNewAnswerCommentNotification({
        answerComment,
    }: AnswerCommentCreatedEvent) {
        const answer = await this.answerRepository.findById(
            answerComment.answerId.toString()
        )

        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `New comment in 
                "${answer.content.substring(0, 40).concat('...')}"`,
                content: answerComment.content,
            })
        }
    }
}
