import { errorCodes, FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof errorCodes.FST_ERR_VALIDATION) {
    return reply
      .badRequest()
      .send({ success: false, message: 'Invalid request data', details: error.validation })
  }
  if (error instanceof errorCodes.FST_ERR_NOT_FOUND) {
    return reply.notFound().send({ success: false, message: 'Resource not found' })
  }
  return reply.internalServerError().send({ success: false, message: 'Internal server error.' })
}
