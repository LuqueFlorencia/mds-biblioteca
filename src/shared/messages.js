export const Messages = {
    SUCCESS: {
		CREATED: (entity) => `${entity} creado correctamente.`,
		UPDATED: (entity) => `${entity} actualizado correctamente.`,
		DELETED: (entity) => `${entity} eliminado correctamente.`,
		RESTORED: (entity) => `${entity} restaurado correctamente.`,

		LOGOUT: () => `Sesión cerrada.`,
		FORGOT_PASS: () => `Si el email existe, te enviamos instrucciones.`,
		RESTORED_PASS: () => `Contraseña restablecida.`,
    },

    ERROR: {
		NOT_FOUND: (entity) => `${entity} no encontrado.`,
		NO_CHANGES: (entity) => `${entity} sin cambios.`,
		DUPLICATE: (entity) => `Ya existe un ${entity.toLowerCase()}.`,
		CREATE_FAILED: (entity) => `No se pudo crear el ${entity.toLowerCase()}.`,
		UPDATE_FAILED: (entity) => `No se pudo actualizar el ${entity.toLowerCase()}.`,
		DELETE_FAILED: (entity) => `No se pudo eliminar el ${entity.toLowerCase()}.`,

		REQUIRED: (attribute) => `${attribute} es requerido y debe ser válido.`,
		MAX_CHARACTERS: (attribute, max) => `${attribute} debe tener ≤ ${max} caracteres.`,
		NUMBER_POSITIVE: (attribute) => `${attribute} no puede ser negativo.`,
		INVALID_VALUE: (attribute) => `${attribute} no es un valor permitido o es inválido.`,
		EXPIRED: (attribute) => `${attribute} proporcionado expiro`,
		DATE_REQUIRED: (attribute) => `${attribute} es requerido y debe ser una cadena de fecha.`,
		DATE_VALID: (attribute) => `${attribute} no tiene un formato de fecha válido.`,
    },
};