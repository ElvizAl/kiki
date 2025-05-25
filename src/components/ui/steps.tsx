import * as React from "react"

interface StepsProps {
  currentStep: number
  totalSteps: number
  children: React.ReactNode
}

export function Steps({ currentStep, totalSteps, children }: StepsProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {childrenArray.map((step, index) => (
          <React.Fragment key={index}>
            {step}
            {index < childrenArray.length - 1 && (
              <div className="flex-1 h-1 bg-muted mx-2">
                <div
                  className="h-1 bg-primary transition-all"
                  style={{
                    width: currentStep >= index + 1 ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface StepProps {
  id: string
  title: string
  description?: string
}

export function Step({ id, title, description }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">{title}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </div>
  )
}
