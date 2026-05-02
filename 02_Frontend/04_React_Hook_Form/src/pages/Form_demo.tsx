import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { form_data } from "../assets/utils";
import axios from "axios";

function DemoForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<form_data>();

  const onSubmit: SubmitHandler<form_data> = async (data) => {
    const url = `http://localhost:8000/api/demos/hook_form`;
    console.log("Form Data:", data);
    const resp = await axios.post(url, data).then(res => res.data);
    console.log('Server Response : ', resp)
  };

  return (
    <div id="center" className="w-full justify-center text-xl m-2 py-4 px-4 bg-gray-300 bg ring-2 ring-gray-600 shadow-xl shadow-gray-400">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full justify-start flex flex-col gap-3 items-center1">
        {/* Text input */}
        <div className="flex flex-row gap-6">
          <label>Task Name : </label>
          <input
            type="text"
            className="ring-2 ring-gray-500 px-2 mx-2"
            {...register("taskName", { required: "Task name is required" })}
          />
          {errors.taskName && <p style={{ color: "red" }}>{errors.taskName.message}</p>}
        </div>

        {/* Email input */}
        <div className="flex flex-row gap-6">
          <label>Email : </label>
          <input
            type="email"
            className="ring-2 ring-gray-500 px-2 mx-2"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        {/* Password input */}
        <div className="flex flex-row gap-6">
          <div className="">
            <label>Password : </label>
            <input
              type={showPassword ? "text" : "password"} // toggle between text and password
              className="ring-2 ring-gray-500 px-2 mx-2"
              {...register("password", {
                required: "Password is required", pattern: {
                  // (?=.*[A-Z]): at least one uppercase
                  // (?=.*[a-z]): at least one lowercase
                  // (?=.*[0-9]): at least one number
                  // (?=.*[!@#$%^&*]): at least one special character
                  // .{12,}: at least 12 characters long
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$/,
                  message: "Password must contain uppercase, lowercase, number, special symbol, and be 12+ chars"
                }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        </div>

        {/* Number input */}
        <div className="flex flex-row gap-6">
          <label>Age : </label>
          <input
            type="number"
            className="ring-2 ring-gray-500 px-2 mx-2"
            {...register("age", { required: "Age is required", min: { value: 1, message: "Must be positive" }, max: { value: 100, message: 'cannot be more than 100' } })}
          />
          {errors.age && <p style={{ color: "red" }}>{errors.age.message}</p>}
        </div>

        {/* Radio buttons */}
        <div className="flex flex-row gap-6">
          <label>Priority : </label>
          <label>
            <input type="radio" value="High" {...register("priority", { required: "Priority is required" })} /> High
          </label>
          <label>
            <input type="radio" value="Low" {...register("priority")} /> Low
          </label>
          {errors.priority && <p style={{ color: "red" }}>{errors.priority.message}</p>}
        </div>

        {/* Checkboxes */}
        <div className="flex flex-row gap-6">
          <label>Tags : </label>
          <label><input type="checkbox" value="Work" {...register("tags")} /> Work</label>
          <label><input type="checkbox" value="Personal" {...register("tags")} /> Personal</label>
          <label><input type="checkbox" value="Urgent" {...register("tags")} /> Urgent</label>
        </div>

        {/* Select dropdown */}
        <div>
          <label>Status : </label>
          <select {...register("status", { required: "Status is required" })}>
            <option value="">-- Select --</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && <p style={{ color: "red" }}>{errors.status.message}</p>}
        </div>

        {/* Textarea */}
        <div>
          <label>Description : </label>
          <textarea className="ring-2 ring-gray-500 px-2 mx-2"
            {...register("description", { minLength: { value: 10, message: "At least 10 characters" } })}
          />
          {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
        </div>

        {/* Date input */}
        <div className="flex flex-row gap-6">
          <label>Due Date : </label>
          <input type="date" className="" {...register("dueDate", { required: "Due date is required" })} />
          {errors.dueDate && <p style={{ color: "red" }}>{errors.dueDate.message}</p>}
        </div>

        {/* Time input */}
        <div className="flex flex-row gap-6">
          <label>Due Time : </label>
          <input type="time" className="" {...register("dueTime", { required: "Due time is required" })} />
          {errors.dueTime && <p style={{ color: "red" }}>{errors.dueTime.message}</p>}
        </div>

        {/* Color input */}
        <div className="flex flex-row gap-6">
          <label>Favorite Color : </label>
          <input type="color" {...register("favoriteColor", { required: "Color is required" })} />
          {errors.favoriteColor && <p style={{ color: "red" }}>{errors.favoriteColor.message}</p>}
        </div>

        {/* Range input */}
        <div className="flex flex-row gap-6">
          <label>Progress (0-100) : </label>
          <input type="range" min="0" max="100" defaultValue={0} {...register("progress", { required: "Progress is required" })} />
          {errors.progress && <p style={{ color: "red" }}>{errors.progress.message}</p>}
        </div>

        {/* File input */}
        <div className="flex flex-row gap-6">
          <label>Upload File : </label>
          <input type="file" {...register("fileUpload", /*{ required: "File is required"} */)} />
          {errors.fileUpload && <p style={{ color: "red" }}>{errors.fileUpload.message}</p>}
        </div>

        <div className="flex flex-row gap-6">
          {/* Submit button */}
          <input type="submit" value="Submit Form" className="rounded px-4 bg-green-600 text-white" />

          {/* Clear button */}
          <button type="button" onClick={() => reset()} className="rounded px-4 bg-red-400 text-white">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default DemoForm;