import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

interface AIInsightsProps {
  transactions: any[];
  balance: number;
  monthlyIncome: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions, balance, monthlyIncome }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<number | null>(null);

  useEffect(() => {
    analyzeTransactions();
    predictFutureExpenses();
  }, [transactions, balance, monthlyIncome]);

  const analyzeTransactions = () => {
    const newInsights: string[] = [];

    // Analyze spending patterns
    const recentTransactions = transactions.slice(0, 30);
    const categories = recentTransactions.reduce((acc: any, t: any) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    // Find highest spending category
    const highestCategory = Object.entries(categories).reduce((a: any, b: any) => 
      b[1] > a[1] ? b : a
    );

    // Calculate savings rate
    const monthlyExpenses = recentTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

    // Generate insights
    if (savingsRate < 20) {
      newInsights.push("Your savings rate is below recommended levels. Consider reducing discretionary spending.");
    }

    if (highestCategory[1] > monthlyIncome * 0.3) {
      newInsights.push(`High spending detected in ${highestCategory[0]}. This category represents over 30% of your income.`);
    }

    if (balance < monthlyIncome * 0.5) {
      newInsights.push("Your current balance is lower than recommended emergency fund levels.");
    }

    setInsights(newInsights);
  };

  const predictFutureExpenses = async () => {
    try {
      // Simple linear regression model
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

      // Prepare data
      const expenses = transactions
        .filter((t: any) => t.type === 'expense')
        .map((t: any) => t.amount);
      
      if (expenses.length > 0) {
        const xs = tf.tensor2d([...Array(expenses.length).keys()], [expenses.length, 1]);
        const ys = tf.tensor2d(expenses, [expenses.length, 1]);

        // Train model
        await model.fit(xs, ys, { epochs: 100 });

        // Make prediction for next month
        const prediction = model.predict(tf.tensor2d([[expenses.length]])) as tf.Tensor;
        const predictedValue = await prediction.data();
        setPrediction(Math.round(predictedValue[0]));
      }
    } catch (error) {
      console.error('Error in prediction:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
      </div>

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-purple-50 rounded-lg flex items-start"
          >
            <AlertTriangle className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
            <p className="text-purple-700">{insight}</p>
          </div>
        ))}

        {prediction && (
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="font-medium text-indigo-900">Expense Prediction</h3>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-indigo-600 mr-1" />
              <p className="text-indigo-700">
                Predicted expenses for next month: ₹{prediction.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;