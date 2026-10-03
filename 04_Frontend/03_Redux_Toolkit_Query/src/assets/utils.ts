export type data_type = {
    id: number | string | null | undefined,
    first_name: string | null | undefined,
    last_name: string | null | undefined,
    email: string | null | undefined,
    gender: string | null | undefined,
    ip_address: string | null | undefined,
    department: string | null | undefined,
    project: string | null | undefined,
    job_title: string | null | undefined,
    salary: string | null | undefined,
    address: {
        main: string | null | undefined,
        street: string | null | undefined,
        city: string | null | undefined,
        state: string | null | undefined,
    }
}
