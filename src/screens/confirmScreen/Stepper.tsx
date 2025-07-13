import React from 'react';
import { View, Text } from 'react-native';

export interface Step {
  title: string;
  content: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <View className="flex-row items-center mb-5 justify-between">
      {steps.map((step, index) => (
        <View key={index} className="justify-center items-center">
          {index > 0 && (
            <View
              className={`flex-1 h-0.5 ${
                index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
          <View
            className={`w-8 h-8 rounded-full ${
              index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
            } justify-center items-center`}
          >
            <Text className="text-base font-bold text-white">
              {index < currentStep ? '✓' : index + 1}
            </Text>
          </View>
          <Text className="text-center mt-2">{step.title}</Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(Stepper);