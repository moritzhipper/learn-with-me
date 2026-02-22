import { errorCodes, FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof errorCodes.FST_ERR_VALIDATION) {
    return reply
      .badRequest()
      .send({ success: false, message: 'Larry could not process your request.' })
  }
  if (error instanceof errorCodes.FST_ERR_NOT_FOUND) {
    return reply
      .notFound()
      .send({ success: false, message: 'Larry was not able to find the resource.' })
  }
  return reply
    .internalServerError()
    .send({ success: false, message: 'Larry encountered an internal server error.' })
}
