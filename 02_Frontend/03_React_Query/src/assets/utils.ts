export type data_type = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    ip_address: string,
    department: string,
    project: string,
    job_title: string,
    salary: string,
    address: {
        main: string,
        street: string,
        city: string,
        state: string | null
    }
}
