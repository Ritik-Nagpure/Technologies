import axios from "axios";
import type { data_type } from "./utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";

// Fetch all users (for table)
export const fetchUsers = async (id_arr: string[]): Promise<data_type[] | undefined> => {
    console.log(id_arr);
    const res = await axios.get('http://localhost:8000/api/demos/react_query', {
        params: { ids: id_arr.join(',') }
    })
    return res.data;
};

// Mutation to create user
export const createUser = async (newUser: data_type): Promise<data_type> => {
    const res = await axios.post<data_type>(
        'http://localhost:8000/api/demos/react_query/', newUser);
    return res.data;
};

export function useCreateUser(setids: React.Dispatch<React.SetStateAction<string[]>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,

        // Optimistic update
        onMutate: async (newUser) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData<data_type[]>(['users']);

            // Generate a temp id if none provided
            const tempId: string = String(newUser.id) ?? String(Date.now())

            // Optimistically update ids
            setids(prev => [...prev, tempId]);

            // Optimistically update cache
            queryClient.setQueryData<data_type[]>(['users'], old => [
                ...(old ?? []),
                { ...newUser, id: tempId }
            ]);

            return { previousUsers, tempId };
        },

        // Rollback if error
        onError: (err, newUser, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
            setids(prev => prev.filter(id => id !== String(context?.tempId)));
        },

        onSuccess: (serverUser, newUser, context) => {
            if (context?.tempId) {
                // Replace temp id with real id in ids state
                setids(prev =>
                    prev.map(id => (id === String(context.tempId) ? String(serverUser.id) : id))
                );

                // Replace optimistic user with server response in cache
                queryClient.setQueryData<data_type[]>(['users'], old =>
                    (old ?? []).map(u =>
                        u.id === context.tempId ? serverUser : u
                    )
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

const patchUser = async (updatedUser: data_type): Promise<data_type> => {
    const res = await axios.patch<data_type>(
        `http://localhost:8000/api/demos/react_query/${updatedUser.id}`,
        updatedUser
    );
    return res.data;
};

export function usePatchUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchUser,
        onMutate: async (updatedUser) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<data_type[]>(['users']);

            // Optimistically update cache
            queryClient.setQueryData<data_type[]>(['users'], old =>
                (old ?? []).map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u)
            );

            return { previousUsers };
        },
        onError: (err, updatedUser, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
        },
        onSuccess: (serverUser) => {
            // Replace with server’s authoritative object
            queryClient.setQueryData<data_type[]>(['users'], old =>
                (old ?? []).map(u => u.id === serverUser.id ? serverUser : u)
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/demos/react_query/${id}`);
};

export function useDeleteUser(setids: React.Dispatch<React.SetStateAction<string[]>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<data_type[]>(['users']);

            // Optimistically remove from ids and cache
            setids(prev => prev.filter(existingId => String(existingId) !== id));
            queryClient.setQueryData<data_type[]>(['users'], old =>
                (old ?? []).filter(u => String(u.id) !== id)
            );

            return { previousUsers };
        },
        onError: (err, id, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
            // Optionally re-add id to state if rollback needed
            setids(prev => [...prev, id]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
