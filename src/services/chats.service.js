import messageModel from '../dao/models/message.model.js'

export const getChatService = async () => {
    try {
        const messages = await messageModel.find().lean().exec()
        return messages
    } catch (error) {
        console.error('Error getting chat messages: ', error)
        throw error
    }
}

/* 
export const getChatService = async () => {
    const messages = await messageModel.find().lean().exec()
    return messages
} */