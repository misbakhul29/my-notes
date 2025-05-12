import { SignupFormSchema, LoginFormSchema, FormState } from '@/app/lib/definitions'

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    const res = await fetch('https://notes-api.dicoding.dev/v1/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
        return {
            error: 'Failed to create user',
        }
    }

    return {
        message: 'User created successfully',
    }
}

export async function login(state: FormState, formData: FormData) {
    console.log('Login function called');
    console.log(formData);

    // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    const res = await fetch('https://notes-api.dicoding.dev/v1/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        return {
            error: 'Failed to login',
        }
    }

    const data = await res.json();

    return {
        message: 'Login successful',
        token: data.data.accessToken,
    }
}

export async function SignOut() {
    const res = await fetch('https://notes-api.dicoding.dev/v1/logout', {
        method: 'POST',
    })

    if (!res.ok) {
        return {
            error: 'Failed to logout',
        }
    }

    return {
        message: 'Logout successful',
    }
}
