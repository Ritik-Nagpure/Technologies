import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { data_type } from '../assets/utils';

import { useUpdateByIdMutation, useDeleteByIdMutation, useCreateEntryMutation, useGetByIdsQuery } from '../store/all_items';

let fetchIds: string[] = [];

const UserFormAndTable = () => {

    const [action, setAction] = useState<'create' | 'update'>('create');
    const [formData, setFormData] = useState<Partial<data_type>>({} as data_type);

    const [ids, setids] = useState<string[]>([])

    const matchIdState = (actionhere?: 'cu' | 'del', fdatanew?: string) => {
        // const ans = fetchIds.every(val => ids.includes(val))

        setids((prev) => {
            let oldone = [...prev];

            let all_ids = Array.from(new Set([...fetchIds, ...oldone]))
            // const final_Ids = all_ids)

            if (actionhere === 'cu' && fdatanew) {
                // console.log('setting..cu');
                all_ids.push(fdatanew)
            }

            if (actionhere === 'del' && fdatanew) {
                // console.log('setting..del', typeof (fdatanew));
                all_ids = all_ids.filter(item => String(item) !== String(fdatanew))
            }
            fetchIds = Array.from(new Set(all_ids));

            // console.log(actionhere, fdatanew, all_ids, 'set here', [...fetchIds, ...ids]);
            // console.log(ids, 'and', fetchIds);
            return fetchIds
        });
        console.log(ids);
    }

    useEffect(() => matchIdState(), [])

    const { data: users, refetch } = useGetByIdsQuery(fetchIds, {
        pollingInterval: 2000
    })
    const [createMutation, { isLoading: createLoading }] = useCreateEntryMutation();
    const [updateMutation, { isLoading: updateLoading }] = useUpdateByIdMutation();
    const [deleteMutation, { isLoading: deleteLoading }] = useDeleteByIdMutation();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        console.log(action);
        e.preventDefault();
        if (action === 'create') {
            createMutation(formData as data_type);
        } else {
            updateMutation(formData as data_type);
        }
        matchIdState('cu', String(formData.id))
        refetch();
    };

    const handleDelete = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;   // Get the form element
        const idInput = form.elements.namedItem("deleting_id") as HTMLInputElement; // Access the input by its name
        const iddel = String(idInput.value);

        if (!iddel) {
            alert("Please enter a valid ID to delete");
            return;
        }
        // Confirmation popup
        const confirmed = window.confirm(`Are you sure you want to delete user with ID ${iddel}?`);
        if (!confirmed) {
            return; // stop if user cancels
        }
        matchIdState('del', iddel)
        deleteMutation(iddel);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | undefined>) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1] as keyof NonNullable<data_type["address"]>;
            setFormData((prev) => ({
                ...prev,
                address: {
                    main: prev.address?.main ?? null,
                    street: prev.address?.street ?? null,
                    city: prev.address?.city ?? null,
                    state: prev.address?.state ?? null,
                    [field]: value || null,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="p-4">

            <Createupdatenode handleSubmit={handleSubmit} handleChange={handleChange} createLoading={createLoading} updateLoading={updateLoading} setAction={setAction} formData={formData} />

            <Deletenode deleteLoading={deleteLoading} handleDelete={handleDelete} />

            <Tablenode ids={fetchIds} userslist={users} refetch={refetch} />

        </div >
    );
}

interface craeteupdatenodeprops {
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    createLoading: boolean;
    updateLoading: boolean;
    setAction: Dispatch<SetStateAction<"create" | "update">>;
    formData: Partial<data_type>;
}

const Createupdatenode = ({ handleSubmit, handleChange, createLoading, updateLoading, setAction, formData }: craeteupdatenodeprops) => (
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
                    <input className="px-4" name="id" placeholder="ID" value={formData.id ?? ""} onChange={handleChange} />
                    <input className="px-4" name="first_name" placeholder="First Name" value={formData.first_name ?? ""} onChange={handleChange} />
                    <input className="px-4" name="last_name" placeholder="Last Name" value={formData.last_name ?? ""} onChange={handleChange} />
                    <input className="px-4" name="email" placeholder="Email" value={formData.email ?? ""} onChange={handleChange} />
                    <input className="px-4" name="gender" placeholder="Gender" value={formData.gender ?? ""} onChange={handleChange} />
                    <input className="px-4" name="ip_address" placeholder="IP Address" value={formData.ip_address ?? ""} onChange={handleChange} />
                    <input className="px-4" name="department" placeholder="Department" value={formData.department ?? ""} onChange={handleChange} />
                    <input className="px-4" name="project" placeholder="Project" value={formData.project ?? ""} onChange={handleChange} />
                    <input className="px-4" name="job_title" placeholder="Job Title" value={formData.job_title ?? ""} onChange={handleChange} />
                    <input className="px-4" name="salary" placeholder="Salary" value={formData.salary ?? ""} onChange={handleChange} />
                    <input className="px-4" name="address.main" placeholder="Address Main" value={formData.address?.main ?? ""} onChange={handleChange} />
                    <input className="px-4" name="address.street" placeholder="Street" value={formData.address?.street ?? ""} onChange={handleChange} />
                    <input className="px-4" name="address.city" placeholder="City" value={formData.address?.city ?? ""} onChange={handleChange} />
                    <input className="px-4" name="address.state" placeholder="State" value={formData.address?.state ?? ""} onChange={handleChange} />

                </div>
                <div className='w-full flex justify-center items-center gap-6 '>
                    <button
                        type="submit"
                        onClick={() => setAction('create')}
                        disabled={createLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {createLoading ? 'Creating...' : 'Create User'}
                    </button>

                    <button
                        type="submit"
                        onClick={() => setAction('update')}
                        disabled={updateLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {updateLoading ? 'Updating...' : 'Update User'}
                    </button>
                </div>
            </form>
        </div>
    </section >
)

interface deletenodeprops {
    deleteLoading: boolean,
    handleDelete: (e: React.SubmitEvent<HTMLFormElement>) => void,
}

const Deletenode = ({ deleteLoading, handleDelete }: deletenodeprops) => (
    <section className='w-full'>
        <div className='h-0.5 bg-gray-500 rounded-full mx-24 my-4'></div>
        <div className='w-full flex justify-center text-2xl my-1 font-bold text-orange-500 font-sans'>
            Delete Data
        </div>
        <div className='h-1 bg-orange-500 rounded-full mx-170'></div>

        <form onSubmit={handleDelete} className="flex flex-row justify-center gap-4 my-2">
            <input
                name="deleting_id"
                placeholder="ID"
                className="px-4"
            />
            <button
                type="submit"
                disabled={deleteLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {deleteLoading ? "Deleting..." : "Delete User"}
            </button>
        </form>
    </section>
)

interface tablenode {
    ids: number[] | string[],
    userslist: data_type[] | undefined,
    refetch: () => void
}

const Tablenode = ({ ids, userslist, refetch }: tablenode) => (
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
                    {userslist?.map((user) => (
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


export default UserFormAndTable