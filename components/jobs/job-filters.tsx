"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";

interface FilterState {
  query: string;
  location: string;
  datePosted: string;
  remoteOnly: boolean;
  employmentTypes: string[];
  experienceLevels: string[];
  salaryRange: [number, number];
}

interface JobFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const employmentTypeOptions = [
  { id: "fulltime", label: "Full-time" },
  { id: "parttime", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "intern", label: "Internship" },
];

const experienceLevelOptions = [
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "director", label: "Director" },
];

export function JobFilters({
  filters,
  onFiltersChange,
  onSearch,
  isLoading,
}: JobFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: "employmentTypes" | "experienceLevels", value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const resetFilters = () => {
    onFiltersChange({
      query: "",
      location: "",
      datePosted: "all",
      remoteOnly: false,
      employmentTypes: [],
      experienceLevels: [],
      salaryRange: [0, 300000],
    });
  };

  const activeFilterCount =
    (filters.remoteOnly ? 1 : 0) +
    filters.employmentTypes.length +
    filters.experienceLevels.length +
    (filters.datePosted !== "all" ? 1 : 0) +
    (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 300000 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Date Posted */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Posted</Label>
        <Select
          value={filters.datePosted}
          onValueChange={(value) => updateFilter("datePosted", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="3days">Last 3 days</SelectItem>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Remote Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remote"
          checked={filters.remoteOnly}
          onCheckedChange={(checked) =>
            updateFilter("remoteOnly", checked === true)
          }
        />
        <Label htmlFor="remote" className="text-sm cursor-pointer">
          Remote jobs only
        </Label>
      </div>

      {/* Employment Type */}
      <Accordion type="single" collapsible defaultValue="employment">
        <AccordionItem value="employment" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
            Employment Type
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {employmentTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={filters.employmentTypes.includes(option.id)}
                    onCheckedChange={() =>
                      toggleArrayFilter("employmentTypes", option.id)
                    }
                  />
                  <Label htmlFor={option.id} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Experience Level */}
      <Accordion type="single" collapsible defaultValue="experience">
        <AccordionItem value="experience" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
            Experience Level
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {experienceLevelOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={filters.experienceLevels.includes(option.id)}
                    onCheckedChange={() =>
                      toggleArrayFilter("experienceLevels", option.id)
                    }
                  />
                  <Label htmlFor={option.id} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Salary Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Salary Range</Label>
          <span className="text-xs text-muted-foreground">
            ${filters.salaryRange[0].toLocaleString()} - $
            {filters.salaryRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={filters.salaryRange}
          onValueChange={(value) =>
            updateFilter("salaryRange", value as [number, number])
          }
          min={0}
          max={300000}
          step={10000}
          className="py-4"
        />
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full rounded-xl"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Search Bar */}
      <Card className="rounded-2xl border-border mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Job title, skills, or company"
                value={filters.query}
                onChange={(e) => updateFilter("query", e.target.value)}
                className="pl-10 rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <div className="flex-1 md:max-w-xs relative">
              <Input
                placeholder="Location (city, state, or remote)"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-xl md:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={onSearch}
                disabled={isLoading}
                className="rounded-xl px-6"
              >
                {isLoading ? "Searching..." : "Search Jobs"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden md:block w-64 shrink-0"
        >
          <Card className="rounded-2xl border-border sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount} active</Badge>
                )}
              </div>
              <FiltersContent />
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-background p-4 overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FiltersContent />
            <Button
              className="w-full mt-6 rounded-xl"
              onClick={() => {
                setShowMobileFilters(false);
                onSearch();
              }}
            >
              Apply Filters
            </Button>
          </motion.div>
        )}
      </div>
    </>
  );
}
