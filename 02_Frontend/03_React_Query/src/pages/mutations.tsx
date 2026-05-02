import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { data_type } from '../assets/utils';
import { useCreateUser, usePatchUser, useDeleteUser, fetchUsers } from '../assets/mutations';

const UserFormAndTable = () => {
    const [ids, setids] = useState<string[]>([]);
    const [action, setAction] = useState<'create' | 'update'>('create');

    const { data: users, refetch } = useQuery({
        queryKey: ['users', ids],
        queryFn: () => fetchUsers(ids),
        enabled: ids.length > 0
    });

    const [formData, setFormData] = useState<Partial<data_type>>({} as data_type);
    const createMutation = useCreateUser(setids);
    const updateMutation = usePatchUser();
    const deleteMutation = useDeleteUser(setids);

    const handleSubmit = (e: React.FormEvent) => {
        console.log(action);
        e.preventDefault();
        if (action === 'create') {
            createMutation.mutate(formData as data_type);
        } else {
            updateMutation.mutate(formData as data_type);
        }
    };

    const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Get the form element
        const form = e.currentTarget;
        // Access the input by its name
        const idInput = form.elements.namedItem("id") as HTMLInputElement;
        const id = String(idInput.value);

        if (!id) {
            alert("Please enter a valid ID to delete");
            return;
        }
        // Confirmation popup
        const confirmed = window.confirm(`Are you sure you want to delete user with ID ${id}?`);
        if (!confirmed) {
            return; // stop if user cancels
        }
        deleteMutation.mutate(id);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address!, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const Createupdatenode = () => (
        <section className='w-full justify-center items-center'>
            <div className='h-0.5 bg-gray-500 rounded-full mx-24 my-4'></div>
            <div className='w-full flex justify-center text-2xl my-1 font-bold text-orange-500 font-sans'>
                Post / Update Data
            </div>
            <div className='h-1 bg-orange-500 rounded-full mx-150'></div>

            <div className='mx-10'>

                {/* Form */}
                <form onSubmit={handleSubmit} >
                    <div className="grid grid-cols-6 mx-2 px-4 space-y-2 my-2">
                        <input className='px-4' name="id" placeholder="ID" onChange={handleChange} />
                        <input className='px-4' name="first_name" placeholder="First Name" onChange={handleChange} />
                        <input className='px-4' name="last_name" placeholder="Last Name" onChange={handleChange} />
                        <input className='px-4' name="email" placeholder="Email" onChange={handleChange} />
                        <input className='px-4' name="gender" placeholder="Gender" onChange={handleChange} />
                        <input className='px-4' name="ip_address" placeholder="IP Address" onChange={handleChange} />
                        <input className='px-4' name="department" placeholder="Department" onChange={handleChange} />
                        <input className='px-4' name="project" placeholder="Project" onChange={handleChange} />
                        <input className='px-4' name="job_title" placeholder="Job Title" onChange={handleChange} />
                        <input className='px-4' name="salary" placeholder="Salary" onChange={handleChange} />
                        <input className='px-4' name="address.main" placeholder="Address Main" onChange={handleChange} />
                        <input className='px-4' name="address.street" placeholder="Street" onChange={handleChange} />
                        <input className='px-4' name="address.city" placeholder="City" onChange={handleChange} />
                        <input className='px-4' name="address.state" placeholder="State" onChange={handleChange} />
                    </div>
                    <div className='w-full flex justify-center items-center gap-6 '>
                        <button
                            type="submit"
                            onClick={() => setAction('create')}
                            disabled={createMutation.isPending}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create User'}
                        </button>

                        <button
                            type="submit"
                            onClick={() => setAction('update')}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {updateMutation.isPending ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </section >
    )

    const Deletenode = () => (
        <section className='w-full'>
            <div className='h-0.5 bg-gray-500 rounded-full mx-24 my-4'></div>
            <div className='w-full flex justify-center text-2xl my-1 font-bold text-orange-500 font-sans'>
                Delete Data
            </div>
            <div className='h-1 bg-orange-500 rounded-full mx-170'></div>

            <form onSubmit={handleDelete} className="flex flex-row justify-center gap-4 my-2">
                <input
                    name="id"
                    placeholder="ID"
                    className="px-4"
                />
                <button
                    type="submit"
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {deleteMutation.isPending ? "Deleting..." : "Delete User"}
                </button>
            </form>
        </section>
    )

    const Tablenode = () => (
        <section className='w-full'>
                <div className='h-0.5 bg-gray-500 rounded-full mx-24 my-4'></div>
                <div className='w-full flex flex-row justify-center text-2xl my-1 font-bold text-orange-500 font-sans gap-10'>
                    Table Data
                </div>
                <div className='flex flex-row gap-4'>
                    <button className='bg-blue-400 text-white px-4 py-1 m-1 rounded-xl text-sm' onClick={() => refetch()}>Referesh</button>
                    <div>{ids.join(' , ')}</div>
                </div>
                <div className='h-1 bg-orange-500 rounded-full mx-170'></div>

                <div className='mx-24'>
                    {/* Table */}
                    <table className=" mt-6 border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Job Title</th>
                                <th className="border p-2">Department</th>
                                <th className="border p-2">Salary</th>
                                <th className="border p-2">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user.id}>
                                    <td className="border p-2">{user?.id}</td>
                                    <td className="border p-2">{user?.first_name} {user?.last_name}</td>
                                    <td className="border p-2">{user?.email}</td>
                                    <td className="border p-2">{user?.job_title}</td>
                                    <td className="border p-2">{user?.department}</td>
                                    <td className="border p-2">{user?.salary}</td>
                                    <td className="border p-2">
                                        {user?.address?.main}, {user?.address?.street}, {user?.address?.city}{user?.address?.state ? `, ${user?.address?.state}` : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
    )
    
    return (
        <div className="p-4">

            <Createupdatenode />

            <Deletenode />

            <Tablenode/>
        </div >
    );
}

export default UserFormAndTable