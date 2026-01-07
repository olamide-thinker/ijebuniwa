"use client";
// File: src/components/ReusableInput.tsx

import React, { ChangeEvent } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./form";
import {
  useFormContext,
  FieldValues,
  Path,
  ControllerRenderProps,
  PathValue,
} from "react-hook-form";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./select";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { constraintSuggestions } from "@/lib/inputeConstraints";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { addDays, format } from "date-fns"
import { Badge } from "./badge";
import { TagInput } from "./inputTagUseThis";
import { DateRange } from "react-day-picker"
import { CgAttachment } from "react-icons/cg";



interface Option {
  label: string | React.ReactNode;
  value: any;
}

interface ReusableInputProps<T extends FieldValues> {
  name: Path<T>; // Name of the field in the form
  label?: string | React.ReactNode; // Label text for the input field
  isDisabled?:boolean
  isFiles?:boolean
  type:
    | "text"
    | "select"
    | "checkbox"
    | "checkbox_arr"
    | "radio"
    | "textarea"
    | "date"
    | "phone"
    | "email"
    | "file"
    | "password"
    | "date_range"
    | "tags"; // Type of the input
  options?: Option[] | string[]; // Options for select and radio types
  placeholder?: string; // Placeholder text for text-based inputs
  handleChange?: (defaultValue: string) => void; // Optional custom change handler
  customConstraint?: (value: any) => string; // Optional custom customConstraint function
  constraintType?: "normal" | "text_only" | "phone" | "email" | "number";
  customInput_fn?: (e: any) => void; //Optional custom input function
  validate?: boolean; // Optional flag to enable validation
  date_minDate?: string;
  date_maxDate?: string;
  tags?: [] | string[];
  description?: string | React.ReactNode;
  setTags?: (e: any) => void;
  className?: string;
  upperCase?:boolean;
}

/**
* `ReusableInput` Component
 * 
 * A versatile input component that supports different input types such as text, select, and checkbox. 
 * It allows for customization of options, change handlers, and constraints.
 * 
 * @template T - The type of the form values object
 * 
 * @ * @example
 * ```tsx
 * <ReusableInput
 *   name="fieldName" // Required: Name of the field
 *   label="Field Label" // Optional: Label text for the input field
 *   type="text" // Required: Type of input (e.g., text, select, checkbox, etc.)
 *   options={[{ label: 'Option 1', value: '1' }, ...]} // Optional: Options for select and radio types
 *   placeholder="Enter text" // Optional: Placeholder text for text-based inputs
 *   handleChange={(value) => console.log(value)} // Optional: Custom change handler
 *   customConstraint={yourCustomConstraintFunction} // Optional: Custom customConstraint function
 *   validate={true} // Optional: Enable or disable validation for password and date
 * />
 * ```
 * 
 * @ * @example
 * ```tsx
 *  <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit((data) => console.log(data))}>
        <ReusableInput
        name="fullName"
        label="Full Name"
        type="text"
        constraintType="text_only"
        placeholder="Enter your full name"
        />
        <ReusableInput
          name="role"
          label="Role"
          type="select"
          options={[
            { label: 'Developer', value: 'developer' },
            { label: 'Designer', value: 'designer' },
          ]}
          placeholder="Select your role"
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
 * 
 * ```
 * 
  * @ * @example
* ```tsx
 * * // Case: select type with boolean values in select options
 * <ReusableInput
 *   name={`classes.${index}.graded`} // Required: Name of the field
 *   label="Report type" // Optional: Label text for the input field
 *   type="select" // Required: Type of input
 *   options={[
 *     { label: "Graded", value: true },
 *     { label: "Ungraded", value: false },
 *   ]} // Optional: Options for select type with boolean values
 *   placeholder="Select an option" // Optional: Placeholder text for select input
 *   customInput_fn={(value) => {
 * 
 * ---------------------------------------------------
 * 
 *     // Make sure to convert value (even if already a boolean) to boolean before updating form state
 *     const booleanValue = value.toString() === "true";
 * 
 * ------------------------------------------------------
 *     setValue(`classes.${index}.graded`, booleanValue);
 *   }} // Optional: Custom function to handle value conversion and form state update
 * />
 * ```
 * 
 */
const ReusableInput = <T extends FieldValues>({
  name,
  label,
  isDisabled=false,
  type,
  upperCase,
  constraintType,
  options,
  isFiles = false,
  placeholder,
  handleChange,
  customConstraint,
  description,
  className,
  date_minDate = "1900-01-01",
  date_maxDate = "",
  customInput_fn,
  tags,
  setTags,
  validate = true,
}: ReusableInputProps<T>): JSX.Element => {


  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<T>();

  
  const [showPassword, setShowPassword] = React.useState(false);
  // disabled={isDisabled}
 
  // Use the suggested customConstraint if no custom customConstraint is provided
  const appliedConstraint =
    customConstraint ||
    constraintSuggestions[constraintType || ""] ||
    (type === "phone" && constraintSuggestions["phone"]) ||
    (type === "email" && constraintSuggestions["email"]);



  // Handles the input change and applies the customConstraint if provided
  const handleInputChange = (
    field: ControllerRenderProps<T, Path<T>>,
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue = event.target.value;

    // Apply the customConstraint function if available
    if (appliedConstraint) {
      newValue = appliedConstraint(newValue);
    }


    field.onChange(newValue);

    
    if (handleChange) {
      handleChange(newValue);
    }
    
    //Convert input to all caps
    if(upperCase && typeof newValue === 'string'){
      newValue = newValue.toUpperCase()
    }
    
    // Validate if the developer wants to use password/Date validation
    if (validate) {
      if (type === "password") {
        const isStrongPassword = validatePassword(newValue);
        if (!isStrongPassword) {
          //i can return something with here later
          console.warn("Password is not strong enough.");
        }
      } else if (type === "date") {
        const isValidDate = validateDate(newValue);
        if (!isValidDate) {
           //i can return something with here later
          console.warn("Selected date is invalid.");
        }
      
      } 
      

      field.onChange(newValue);
      setValue(name, newValue as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }

    setValue(name, newValue as any); // 'as any' is used because setValue expects a value of type `FieldValues`
  };


  /* ------------------------ Validations -------------------------------------------------- */
    // Function to validate password strength
  function validatePassword(password: string) {
    const conditions = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const isValid = Object.values(conditions).every(Boolean);
    return { isValid, conditions };
  }


  // Function to validate a date (ensure it's a valid date within a reasonable range)
  const validateDate = (date: string): boolean => {
    const selectedDate = new Date(date);
    const minDate = new Date(date_minDate);
    const maxDate = new Date(date_maxDate || "2029-01-01");
    return selectedDate >= minDate && selectedDate <= maxDate;
  };

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  })


  // Type guard to check if options are of type Option
  const isOptionArray = (opts: Option[] | string[]): opts is Option[] => {
    return opts.length > 0 && typeof opts[0] === "object" && "label" in opts[0];
  };

//Handling files 
const fileInputRef = React.useRef<HTMLInputElement | null>(null);
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;

  if (isFiles) {
    // If multiple files are allowed, pass the array of files
    const fileArray = Array.from(files);
    setValue(name, fileArray as PathValue<T, Path<T>> )
    // onChange(fileArray);
  } else {
    // Single file
    setValue(name, files[0] as PathValue<T, Path<T>> )
    // onChange(files[0]);
  }
};

const handleButtonPress = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click(); // Trigger the hidden file input
  }
};






/* --------------------- Input types ----------------------------------------------------- */
  // Render different types of inputs based on the `type` prop
  const renderInput = (field: ControllerRenderProps<T, Path<T>>) => {
    switch (type) {

      case "text":
        return (
          <Input
            {...field}
            type="text"
            // disabled={isDisabled}
            placeholder={placeholder}
            className={`${className}`}
            value={field.value ?? ""}
            onChange={
              customInput_fn
                ? customInput_fn
                : (e) => {
                    handleInputChange(field, e);
                  }
            }
          />
        );

 /* -------------------------------------------------------------------------- */
 
 case "file":
  return (
    // <div>
    //   <input
    //     type="file"
    //     multiple={isFiles}
    //     onChange={(e) => {
    //       const files = e.target.files;
    //       if (files) {
    //         const fileArray = Array.from(files);
    //         field.onChange(isFiles ? fileArray : fileArray[0]);
    //         if (handleChange) handleChange(fileArray[0].name);
    //       }
    //     }}
    //     disabled={isDisabled}
    //     className={className}
    //   />
    // </div>
    <>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple={isFiles}
            accept="image/*,application/pdf"
          />
          
          
          {/* Display the selected file(s) */}
          <div className="flex flex-row-reverse items-center justify-between gap-1 p-2 mt-2 border rounded-lg bg-card">
          {/* Button to open file dialog */}
          <Button
          variant={'outline'}
          
            className=""
            onPress={handleButtonPress}
          >
            <CgAttachment/> {isFiles ? "Files" : "File"}
          </Button>


            {isFiles && Array.isArray(field.value) ? (
              <ul>
                {field.value.map((file: any, index: number) => (
                  <li key={index} className="text-sm border">
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : field.value ? (
              <p className="p-1 text-sm border rounded">{(field.value as any).name}</p>
            ) : (
              <p className="text-sm text-gray-500">No file selected</p>
            )}
          </div>
        </>
  );
 
 /* -------------------------------------------------------------------------- */

      case "phone":
        return (
          <Input
            {...field}
            type="tel"
            // disabled={isDisabled}
            placeholder={placeholder}
            className={`${className}`}
            value={field.value ?? ""}
            onChange={
              customInput_fn
                ? customInput_fn
                : (e) => {
                    handleInputChange(field, e);
                  }
            }
          />
        );

  /* -------------------------------------------------------------------------- */

      case "email":
        return (
          <Input
            {...field}
            type="email"
            // disabled={isDisabled}
            placeholder={placeholder}
            className={`${className}`}
            value={field.value || ""}
            onChange={
              customInput_fn
                ? customInput_fn
                : (e) => {
                    handleInputChange(field, e);
                  }
            }
          />
        );

  /* -------------------------------------------------------------------------- */

      case "tags":
        return (
          <TagInput
          // disabled={isDisabled}
            placeholder={placeholder}
            tags={field.value || (tags as string[] | [])}
            setTags={(newTags: any) => {
              // Accept the new tags array
              if (setTags) {
                setTags(newTags); // Only call setTags if it is defined
                setValue(name, newTags as PathValue<T, Path<T>>); // Update form value with the new tags
              }
            }}
          />
          // setTags={ (setTags as (e: any) => void )}/>
        );

/* -------------------------------------------------------------------------- */

      case "password":
        const validation = validatePassword(field.value || "");
        return (
          <div className="relative ">
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              // disabled={isDisabled}
              placeholder={placeholder}
              className={`${className}`}
              value={field.value ?? ""}
              onChange={(e) => {
                const newValue = e.target.value;

                // Only display validation message but do not clear the input
                if (validate && !validatePassword(newValue)) {
                  field.onChange(newValue); // Allow typing
                  setValue(name, newValue as PathValue<T, Path<T>>); // Keep the typed value
                } else {
                  handleInputChange(field, e);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-3.5"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="w-6 h-6" />
              ) : (
                <EyeIcon className="w-6 h-6" />
              )}
            </button>
            {validate && !validation.isValid && (
              <div className="flex flex-wrap gap-2 mt-2">
                {!validation.conditions.length && (
                  <Badge
                    variant={"outline"}
                    className="rounded-full text-destructive border-destructive"
                  >
                    At least 8 characters
                  </Badge>
                )}
                {!validation.conditions.upperCase && (
                  <Badge
                    variant={"outline"}
                    className="rounded-full text-destructive border-destructive"
                  >
                    Uppercase letter
                  </Badge>
                )}
                {!validation.conditions.lowerCase && (
                  <Badge
                    variant={"outline"}
                    className="rounded-full text-destructive border-destructive"
                  >
                    Lowercase letter
                  </Badge>
                )}
                {!validation.conditions.number && (
                  <Badge
                    variant={"outline"}
                    className="rounded-full text-destructive border-destructive"
                  >
                    A number
                  </Badge>
                )}
                {!validation.conditions.specialChar && (
                  <Badge
                    variant={"outline"}
                    className="rounded-full text-destructive border-destructive"
                  >
                    Special character
                  </Badge>
                )}
              </div>
            )}
          </div>
        );

/* -------------------------------------------------------------------------- */

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className="w-full h-12 pl-3 font-normal text-left"
                >
                  {field.value
                    ? format(new Date(field.value), "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                captionLayout="dropdown-buttons"
                mode="single"
                fromYear={1900}
                toYear={2030}
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

                  if (validate && !validateDate(formattedDate)) {
                    setValue(name, "" as PathValue<T, Path<T>>, {
                      shouldValidate: true,
                    });
                  } else {
                    handleInputChange(field, {
                      target: { value: formattedDate },
                    } as ChangeEvent<HTMLInputElement>);
                  }
                }}
                disabled={(date) =>
                  date > new Date(date_maxDate) || date < new Date(date_minDate)
                }
              />
            </PopoverContent>
          </Popover>
        );

/* -------------------------------------------------------------------------- */

      case "date_range":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className="w-full h-12 pl-3 font-normal text-left"
                >

          <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}

                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
              defaultMonth={date?.from}
              selected={date}
  
              numberOfMonths={2}
                captionLayout="dropdown-buttons"
                mode="range"
                fromYear={1900}
                toYear={2030}
                // selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  setDate(date)
                  date && setValue(name, date as PathValue<T, Path<T>>)
                  console.log('this is :', date && format(date.from as Date,'yyyy-MM-dd'), date && format(date.to as Date,'yyyy-MM-dd') )
                  // const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

                  // if (validate && !validateDate(formattedDate)) {
                  //   setValue(name, "" as PathValue<T, Path<T>>, {
                  //     shouldValidate: true,
                  //   });
                  // } else {
                  //   handleInputChange(field, {
                  //     target: { value: formattedDate },
                  //   } as ChangeEvent<HTMLInputElement>);
                  // }
                }}
                disabled={(date) =>
                  date > new Date(date_maxDate) || date < new Date(date_minDate)
                }
              />
            </PopoverContent>
          </Popover>
        );

/* -------------------------------------------------------------------------- */

      case "select":
        return (
          <Select
            {...field}
            // disabled={isDisabled}
            onValueChange={
              customInput_fn
                ? customInput_fn
                : (value) => {
                    handleInputChange(field, {
                      target: { value },
                    } as ChangeEvent<HTMLInputElement>);
                  }
            }
            value={field.value}
          >
            <SelectTrigger className={`${className}`}>
              <SelectValue placeholder={placeholder || "Select an option"} >
                {options && field.value !== undefined
                  ? isOptionArray(options)
                    ? options.find(
                        (option) =>
                          option.value?.toString() === field.value?.toString()
                      )?.label
                    : field.value
                  : placeholder || "Select an option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, idx) =>
                typeof option === "string" ? (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ) : (
                  <SelectItem key={idx} value={(option as Option).value}>
                    {(option as Option).label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        );

  /* -------------------------------------------------------------------------- */

        case "radio" :
          return (
            <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
           {options?.map((option, idx) =>
                typeof option === "string" ? (

                  <FormItem key={idx} className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem   value={option} />
                  </FormControl>
                  <FormLabel className="font-normal">
                  {option}
                  </FormLabel>
                </FormItem>
                ) : (

                  <FormItem key={idx} className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem   value={(option as Option).value} />
                  </FormControl>
                  <FormLabel className="font-normal">
                  {(option as Option).label}
                  </FormLabel>
                </FormItem>
                  )
              )}          
          </RadioGroup>
          );

/* -------------------------------------------------------------------------- */

      case "checkbox":
        return (
          <Checkbox
            className={` p-0 ${className}`}
            // disabled={isDisabled}
            checked={field.value}
            onCheckedChange={(checked) => {
              handleInputChange(field, {
                target: { value: checked },
              } as ChangeEvent<HTMLInputElement>);
            }}
            {...field}
          />
        );

 /* -------------------------------------------------------------------------- */

      case "checkbox_arr":
        return (
          <>
          {options
          //  && field.value !== undefined
            && isOptionArray(options)
              && options?.map((item: Option) => (
            <FormField
              key={item.value}
              control={control}
              name={name}
              render={({field}) => {
                const fieldValue  = field.value || [] as Option[];
                // console.log('---->>>',  fieldValue )

                return (
                  <FormItem
                    key={item.value}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.value)}
                        onCheckedChange={(checked) => {

                          const updatedValues = checked
                            ? [...fieldValue, item.value] // Add checked
                            : fieldValue.filter((value: any) => value !== item.value ); // Remove unchecked
                           
                              console.log('--------->>>>',updatedValues)
                          field.onChange(updatedValues);
                        }}
                      />
                 
                    </FormControl>
                    <FormLabel className="w-full font-normal ">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          </>
        );

 /* -------------------------------------------------------------------------- */

      case "textarea":
        return (
          <Textarea
            {...field}
            // disabled={isDisabled}
            className={`${className}`}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => handleInputChange(field, e)}
          />
        );

      default:
        return null;
    }
  };

  if (type === "checkbox") {
    return (
      <FormField
      disabled={isDisabled}
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl className="m-0">
              <div className="flex items-center gap-2">
                {renderInput(field)}
                {label && <FormLabel className="mb-0">{label}</FormLabel>}
              </div>
            </FormControl>
            {description && <FormDescription> {description} </FormDescription>}
            {errors[name]?.message && (
              <FormMessage>
                {typeof errors[name]?.message === "string"
                  ? errors[name]?.message
                  : "Invalid input"}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  } else {
    return (
      <FormField
        name={name}
        disabled={isDisabled}
        control={control}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel className="">{label}</FormLabel>}
            <FormControl>{renderInput(field)}</FormControl>
            {description && <FormDescription> {description} </FormDescription>}
            {errors[name]?.message && (
              <FormMessage>
                {typeof errors[name]?.message === "string"
                  ? errors[name]?.message
                  : "Invalid input"}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  }
};

export default ReusableInput;
