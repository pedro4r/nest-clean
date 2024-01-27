import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestioCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repositoty'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionCommentCreated implements EventHandler {
    constructor(
        private questionsRepository: QuestionsRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewQuestionCommentNotification.bind(this),
            QuestioCommentCreatedEvent.name
        )
    }

    private async sendNewQuestionCommentNotification({
        questionComment,
    }: QuestioCommentCreatedEvent) {
        const question = await this.questionsRepository.findById(
            questionComment.questionId.toString()
        )

        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `New comment in 
                "${question.title.substring(0, 40).concat('...')}"`,
                content: questionComment.content,
            })
        }
    }
}
