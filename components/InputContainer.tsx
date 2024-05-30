"use client";
import {
  MessageSchemaType,
  messageSchemaZod,
} from "@/lib/types/messageValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const InputContainer = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because month is zero-based
  const currentDay = currentDate.getDate() + 1;

  // State for selected year and month
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    setValue("year", year.toString()); // Convert back to string for form value
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    setValue("month", month.toString()); // Convert back to string for form value
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = parseInt(e.target.value);
    setSelectedDay(day);
    setValue("day", day.toString()); // Convert back to string for form value
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MessageSchemaType>({ resolver: zodResolver(messageSchemaZod) });

  useEffect(() => {
    setValue("year", currentYear.toString());
    setValue("month", currentMonth.toString());
    setValue("day", currentDay.toString());
  }, [setValue, currentYear, currentMonth, currentDay]);

  const onSubmit: SubmitHandler<MessageSchemaType> = async (
    data: MessageSchemaType,
  ) => {
    console.log(data);

    const promise = axios.post("/api/encrypt", data);

    toast.promise(promise, {
      loading: "Sending a ripple in time...",
      success: "Success",
      error: (error) => {
        console.log("Login Error:", error);
        const errorMessage = error.response?.data?.error || "Failed to Encrypt";
        console.log(errorMessage);
        return errorMessage;
      },
    });

    try {
      const response = await promise;
      console.log(response);
      // Reset the form after successful submission
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full items-center justify-center"
    >
      <div className="flex h-[94%] w-[1200px] flex-col gap-[8px] rounded-xl border bg-white p-[32px] shadow-card">
        <input
          type="text"
          {...register("salutation")}
          placeholder={
            errors.salutation
              ? errors.salutation.message
              : 'Enter a Salutation like "Dear Aiah" or "To my friend"'
          }
          className={`mb-4 w-full border-b border-gray-300 p-2 text-h5 font-medium focus:outline-none ${
            errors.salutation ? "border-red-500" : ""
          }`}
        />

        <h4 className="text-p">Write your future message here:</h4>
        <textarea
          id="futureMessage"
          {...register("message")}
          className={`h-[300px] w-full resize-none overflow-auto bg-gray-100 p-4 ${
            errors.message ? "border-red-500" : ""
          }`}
        ></textarea>
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}

        <div className="flex flex-col gap-[8px]">
          <div className="flex gap-[32px]">
            <h4 className="text-p">Choose a date to send the message</h4>
          </div>
          <div className="flex gap-[8px]">
            {/* Month dropdown */}
            <select
              className="rounded border border-gray-300 px-2 py-1"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {months
                .filter((month) => {
                  return (
                    (selectedYear === currentYear &&
                      month.value >= currentMonth) ||
                    selectedYear !== currentYear
                  );
                })
                .map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
            </select>

            {/* Day dropdown */}
            <select
              className="rounded border border-gray-300 px-2 py-1"
              value={selectedDay} // Change from currentDay to selectedDay
              onChange={handleDayChange} // Add onChange handler
            >
              {/* Populate with days based on selected month and year */}
              {/* For simplicity, you can populate with a fixed number of days for now */}
              {Array.from(
                {
                  length: getDaysInMonth(selectedYear, selectedMonth),
                },
                (_, i) => i + 1,
              ).map((day) => {
                if (
                  selectedYear === currentYear &&
                  selectedMonth === currentMonth &&
                  day < currentDay
                ) {
                  return null; // Skip past days
                }
                return (
                  <option key={day} value={day}>
                    {day}
                  </option>
                );
              })}
            </select>

            {/* Year dropdown */}
            <select
              className="rounded border border-gray-300 px-2 py-1"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {[...Array(21)].map((_, index) => {
                const year = currentYear + index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {errors.month && (
          <p className="text-sm text-red-500">{errors.month.message}</p>
        )}
        {errors.day && (
          <p className="text-sm text-red-500">{errors.day.message}</p>
        )}
        {errors.year && (
          <p className="text-sm text-red-500">{errors.year.message}</p>
        )}

        <div className="flex flex-col gap-[8px]">
          <h1 className="text-p">Send to:</h1>
          <input
            type="email"
            placeholder="Please enter an Email"
            {...register("email")}
            className="w-[300px] appearance-none rounded border border-gray-300 px-2 py-1"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex h-[100px] items-center justify-center">
          <button
            type="submit"
            className="rounded-md border-[5px] border-white bg-[#007FFF] px-[32px] py-[16px] text-h6  font-semibold text-white transition hover:border-[#007FFF] hover:bg-white hover:text-black"
          >
            Send it!
          </button>
        </div>
      </div>
    </form>
  );
};

// Function to get the number of days in a month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default InputContainer;
