"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value || null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  )
  const [currentYear, setCurrentYear] = React.useState(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  )

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
    onChange(newDate)
    setIsOpen(false)
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return placeholder
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const calendarDays = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2" />)
    }

    // Days of the month
    for (let day = 1; day <= days; day++) {
      const isSelected = 
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth &&
        new Date().getFullYear() === currentYear

      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={cn(
            "p-2 text-center rounded-lg hover:bg-blue-500/20 transition-colors",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            isToday && !isSelected && "border border-blue-400",
            "text-sm font-medium"
          )}
        >
          {day}
        </button>
      )
    }

    return calendarDays
  }

  // Generate year options (100 years ago to current year)
  const yearOptions = []
  const currentYearNow = new Date().getFullYear()
  for (let year = currentYearNow; year >= currentYearNow - 100; year--) {
    yearOptions.push(year)
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl",
          "focus:outline-none focus:border-blue-500 text-left",
          "flex items-center justify-between transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={selectedDate ? "text-white" : "text-gray-400"}>
          {formatDate(selectedDate)}
        </span>
        <CalendarIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar Popup */}
          <div className="absolute z-50 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full md:w-[320px]">
            {/* Month/Year Selection */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                ←
              </button>

              <div className="flex gap-2 flex-1">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-400 p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Clear Button */}
            {selectedDate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null)
                  onChange(null)
                  setIsOpen(false)
                }}
                className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
