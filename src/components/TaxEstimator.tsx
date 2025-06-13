import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, AlertCircle } from 'lucide-react';

interface TaxEstimatorProps {
  annualIncome: number;
  transactions: any[];
}

interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

const TaxEstimator: React.FC<TaxEstimatorProps> = ({ annualIncome, transactions }) => {
  const [taxableIncome, setTaxableIncome] = useState(annualIncome);
  const [estimatedTax, setEstimatedTax] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const TAX_SLABS: TaxSlab[] = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 750000, rate: 0.10 },
    { min: 750000, max: 1000000, rate: 0.15 },
    { min: 1000000, max: 1250000, rate: 0.20 },
    { min: 1250000, max: 1500000, rate: 0.25 },
    { min: 1500000, max: null, rate: 0.30 }
  ];

  useEffect(() => {
    calculateDeductions();
    calculateTax();
  }, [annualIncome, transactions]);

  const calculateDeductions = () => {
    // Calculate standard deduction
    let totalDeductions = 50000;

    // Calculate investment-related deductions (80C, etc.)
    const investmentDeductions = transactions
      .filter(t => t.category === 'Investments' || t.category === 'Insurance')
      .reduce((sum, t) => sum + t.amount, 0);

    // Add other deductions (medical insurance, education loan interest, etc.)
    const otherDeductions = transactions
      .filter(t => t.category === 'Healthcare' || t.category === 'Education')
      .reduce((sum, t) => sum + t.amount, 0);

    totalDeductions += Math.min(investmentDeductions, 150000); // 80C limit
    totalDeductions += Math.min(otherDeductions, 50000); // Other deductions limit

    setDeductions(totalDeductions);
    setTaxableIncome(Math.max(0, annualIncome - totalDeductions));
  };

  const calculateTax = () => {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const slab of TAX_SLABS) {
      if (remainingIncome <= 0) break;

      const slabAmount = slab.max 
        ? Math.min(remainingIncome, slab.max - slab.min)
        : remainingIncome;

      tax += slabAmount * slab.rate;
      remainingIncome -= slabAmount;
    }

    // Add surcharge if applicable
    if (taxableIncome > 5000000) {
      tax *= 1.10; // 10% surcharge
    }

    // Add health and education cess
    tax *= 1.04; // 4% cess

    setEstimatedTax(Math.round(tax));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold">Tax Estimator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-600 mb-1">Annual Income</p>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-emerald-600 mr-1" />
            <span className="text-2xl font-bold text-emerald-700">
              ₹{annualIncome.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Total Deductions</p>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
            <span className="text-2xl font-bold text-blue-700">
              ₹{deductions.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Estimated Tax</p>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-purple-600 mr-1" />
            <span className="text-2xl font-bold text-purple-700">
              ₹{estimatedTax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Tax Breakdown</h3>
        
        <div className="space-y-2">
          {TAX_SLABS.map((slab, index) => {
            const slabIncome = Math.min(
              Math.max(0, taxableIncome - slab.min),
              slab.max ? slab.max - slab.min : Infinity
            );
            const slabTax = slabIncome * slab.rate;

            if (taxableIncome >= slab.min) {
              return (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>
                      ₹{slab.min.toLocaleString()} - {slab.max ? `₹${slab.max.toLocaleString()}` : 'Above'}
                    </span>
                    <span className="font-medium">{slab.rate * 100}%</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-gray-600">
                    <span>Taxable Amount: ₹{slabIncome.toLocaleString()}</span>
                    <span>Tax: ₹{slabTax.toLocaleString()}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-amber-900">Tax Saving Tips</h4>
          </div>
          <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
            <li>Maximize your 80C investments (up to ₹1.5 lakh)</li>
            <li>Consider health insurance for additional deductions</li>
            <li>Invest in tax-saving mutual funds (ELSS)</li>
            <li>Claim HRA if you're paying rent</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaxEstimator;