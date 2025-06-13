import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

interface SmartBudgetProps {
  transactions: any[];
  monthlyIncome: number;
}

const SmartBudget: React.FC<SmartBudgetProps> = ({ transactions, monthlyIncome }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [predictedExpenses, setPredictedExpenses] = useState<Record<string, number>>({});

  useEffect(() => {
    analyzeSpending();
    predictNextMonthExpenses();
  }, [transactions, monthlyIncome]);

  const analyzeSpending = () => {
    const newRecommendations: string[] = [];
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

    if (savingsRate < 20) {
      newRecommendations.push(
        "Your savings rate is below the recommended 20%. Consider reducing discretionary spending."
      );
    }

    // Analyze category-wise spending
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    Object.entries(categorySpending).forEach(([category, amount]) => {
      const categoryPercentage = (amount / monthlyIncome) * 100;
      if (categoryPercentage > 30) {
        newRecommendations.push(
          `Your ${category} expenses are ${categoryPercentage.toFixed(1)}% of your income. Consider reducing this to 30% or less.`
        );
      }
    });

    setRecommendations(newRecommendations);
  };

  const predictNextMonthExpenses = async () => {
    try {
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

      const categoryPredictions: Record<string, number> = {};
      const categories = [...new Set(transactions.map(t => t.category))];

      for (const category of categories) {
        const categoryExpenses = transactions
          .filter(t => t.category === category && t.type === 'expense')
          .map(t => t.amount);

        if (categoryExpenses.length > 0) {
          const xs = tf.tensor2d([...Array(categoryExpenses.length).keys()], [categoryExpenses.length, 1]);
          const ys = tf.tensor2d(categoryExpenses, [categoryExpenses.length, 1]);

          await model.fit(xs, ys, { epochs: 100 });

          const prediction = model.predict(tf.tensor2d([[categoryExpenses.length]])) as tf.Tensor;
          const predictedValue = await prediction.data();
          categoryPredictions[category] = Math.round(predictedValue[0]);
        }
      }

      setPredictedExpenses(categoryPredictions);
    } catch (error) {
      console.error('Error in prediction:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-semibold">Smart Budget Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium text-purple-900">AI Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start p-3 bg-white rounded-lg shadow-sm"
              >
                <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-purple-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="font-medium text-indigo-900">Next Month Predictions</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(predictedExpenses).map(([category, amount], index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm text-indigo-600 font-medium">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Smart Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            Set up automatic transfers for savings goals
          </li>
          <li className="flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            Review and cancel unused subscriptions
          </li>
          <li className="flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            Consider bulk purchases for regular items
          </li>
          <li className="flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            Track expenses daily for better awareness
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SmartBudget;