"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
}

export function TagInput({
    value = [],
    onValueChange,
    placeholder,
    className,
    ...props
}: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !value.includes(newTag)) {
                onValueChange([...value, newTag]);
                setInputValue("");
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onValueChange(value.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onValueChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className={cn("flex flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 hover:bg-secondary/80">
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        <span className="sr-only">Remove {tag}</span>
                    </button>
                </Badge>
            ))}
            <input
                type="text"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ""}
                {...props}
            />
        </div>
    );
}
