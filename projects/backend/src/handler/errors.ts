import { errorCodes, FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error.message)
  request.log.error(error.cause)
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: 'Larry could not process your request.' })
  }
  if (error instanceof errorCodes.FST_ERR_NOT_FOUND) {
    return reply.status(404).send({ message: 'Larry was not able to find the resource.' })
  }
  return reply.status(500).send({ message: 'Larry encountered an internal server error.' })
}
