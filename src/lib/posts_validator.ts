import Ajv2019 from "ajv/dist/2019"
import schema from "../schema/posts.schema.json"

interface ValidationResult {
    ok: boolean,
    errors?: string[]
}

export function validatePostJson(json: string): ValidationResult {
    const ajv = new Ajv2019({allErrors: true})
    const validator = ajv.compile(schema)
    const is_valid = validator(JSON.parse(json))

    var result: ValidationResult = {ok: is_valid}

    if (!is_valid) {
        result.errors = []
        validator.errors?.forEach((err) => {
            result.errors?.push(JSON.stringify(err, null, 3))
        })
    }
    return result
}
