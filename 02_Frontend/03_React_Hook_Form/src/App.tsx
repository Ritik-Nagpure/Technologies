import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface FormValues {
  taskName: string;
  email: string;
  password: string;
  age: number;
  priority: string;
  tags: string[];
  status: string;
  description: string;
  dueDate: string;
  dueTime: string;
  favoriteColor: string;
  progress: number;
  fileUpload: FileList;
}

function DemoForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div id="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Text input */}
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            {...register("taskName", { required: "Task name is required" })}
          />
          {errors.taskName && <p style={{ color: "red" }}>{errors.taskName.message}</p>}
        </div>

        {/* Email input */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        {/* Password input */}
        <div>
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"} // toggle between text and password
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
              className="password-input"
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
        <div>
          <label>Age:</label>
          <input
            type="number"
            {...register("age", { required: "Age is required", min: { value: 1, message: "Must be positive" }, max: { value: 100, message: 'cannot be more than 100' } })}
          />
          {errors.age && <p style={{ color: "red" }}>{errors.age.message}</p>}
        </div>

        {/* Radio buttons */}
        <div>
          <label>Priority:</label>
          <label>
            <input type="radio" value="High" {...register("priority", { required: "Priority is required" })} /> High
          </label>
          <label>
            <input type="radio" value="Low" {...register("priority")} /> Low
          </label>
          {errors.priority && <p style={{ color: "red" }}>{errors.priority.message}</p>}
        </div>

        {/* Checkboxes */}
        <div>
          <label>Tags:</label>
          <label><input type="checkbox" value="Work" {...register("tags")} /> Work</label>
          <label><input type="checkbox" value="Personal" {...register("tags")} /> Personal</label>
          <label><input type="checkbox" value="Urgent" {...register("tags")} /> Urgent</label>
        </div>

        {/* Select dropdown */}
        <div>
          <label>Status:</label>
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
          <label>Description:</label>
          <textarea
            {...register("description", { minLength: { value: 10, message: "At least 10 characters" } })}
          />
          {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
        </div>

        {/* Date input */}
        <div>
          <label>Due Date:</label>
          <input type="date" {...register("dueDate", { required: "Due date is required" })} />
          {errors.dueDate && <p style={{ color: "red" }}>{errors.dueDate.message}</p>}
        </div>

        {/* Time input */}
        <div>
          <label>Due Time:</label>
          <input type="time" {...register("dueTime", { required: "Due time is required" })} />
          {errors.dueTime && <p style={{ color: "red" }}>{errors.dueTime.message}</p>}
        </div>

        {/* Color input */}
        <div>
          <label>Favorite Color:</label>
          <input type="color" {...register("favoriteColor", { required: "Color is required" })} />
          {errors.favoriteColor && <p style={{ color: "red" }}>{errors.favoriteColor.message}</p>}
        </div>

        {/* Range input */}
        <div>
          <label>Progress (0-100):</label>
          <input type="range" min="0" max="100" value={0} {...register("progress", { required: "Progress is required" })} />
          {errors.progress && <p style={{ color: "red" }}>{errors.progress.message}</p>}
        </div>

        {/* File input */}
        <div>
          <label>Upload File:</label>
          <input type="file" {...register("fileUpload", /*{ required: "File is required"} */)} />
          {errors.fileUpload && <p style={{ color: "red" }}>{errors.fileUpload.message}</p>}
        </div>

        {/* Submit button */}
        <input type="submit" value="Submit Form" />

        {/* Clear button */}
        <button type="button" onClick={() => reset()}>
          Clear Form
        </button>
      </form>
    </div>
  );
}

export default DemoForm;
