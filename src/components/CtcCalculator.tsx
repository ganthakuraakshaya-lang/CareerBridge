import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface CompanyPreset {
  name: string;
  ctc: number;
  base: number;
  variable: number;
  joiningBonus: number;
  stocksFourYears: number;
  desc: string;
}

const PRESETS: CompanyPreset[] = [
  {
    name: 'TCS Ninja',
    ctc: 3.6,
    base: 3.1,
    variable: 0.3,
    joiningBonus: 0,
    stocksFourYears: 0,
    desc: 'Standard Day-1 Mass IT Campus Package'
  },
  {
    name: 'TCS Digital / Prime',
    ctc: 9.0,
    base: 7.2,
    variable: 1.0,
    joiningBonus: 0.8,
    stocksFourYears: 0,
    desc: 'Premier NQT Tier-1 Coding Track'
  },
  {
    name: 'Qualcomm Hardware',
    ctc: 28.0,
    base: 14.5,
    variable: 2.5,
    joiningBonus: 3.0,
    stocksFourYears: 8.0,
    desc: 'Core VLSI & Embedded Campus Offer'
  },
  {
    name: 'Amazon SDE-1',
    ctc: 44.5,
    base: 18.5,
    variable: 0,
    joiningBonus: 7.5,
    stocksFourYears: 18.5,
    desc: 'Tier-1 Product Company Offer'
  },
  {
    name: 'Atlassian Grad',
    ctc: 52.0,
    base: 20.0,
    variable: 2.0,
    joiningBonus: 6.0,
    stocksFourYears: 24.0,
    desc: 'High-Growth Tech SDE Offer'
  },
  {
    name: 'L&T GET (Core)',
    ctc: 7.0,
    base: 5.5,
    variable: 0.8,
    joiningBonus: 0.7,
    stocksFourYears: 0,
    desc: 'Core Engineering & IoT Trainee'
  }
];

export const CtcCalculator: React.FC = () => {
  const [ctc, setCtc] = useState<number>(14.0); // 14 LPA
  const [basePay, setBasePay] = useState<number>(9.0); // 9 LPA Base
  const [variablePay, setVariablePay] = useState<number>(1.5); // 1.5 LPA
  const [joiningBonus, setJoiningBonus] = useState<number>(1.0); // 1 LPA (Year 1)
  const [stocksFourYears, setStocksFourYears] = useState<number>(2.5); // 2.5 LPA worth RSUs

  const applyPreset = (preset: CompanyPreset) => {
    setCtc(preset.ctc);
    setBasePay(preset.base);
    setVariablePay(preset.variable);
    setJoiningBonus(preset.joiningBonus);
    setStocksFourYears(preset.stocksFourYears);
  };

  // Calculations for Indian Compensation Models (Amounts in INR)
  const breakdown = useMemo(() => {
    const baseInr = basePay * 100000;
    const basicComponent = baseInr * 0.45; // ~45% of Base is Basic Salary
    
    // Retirals
    const employerPfAnnual = Math.min(basicComponent * 0.12, 1800 * 12); // standard or actual
    const gratuityAnnual = basicComponent * 0.0481;
    
    // Monthly Gross
    const monthlyGross = (baseInr - employerPfAnnual - gratuityAnnual) / 12;
    
    // Deductions
    const employeePfMonthly = employerPfAnnual / 12;
    const professionalTaxMonthly = 200; // standard ₹2,400/yr
    
    // Income Tax estimation (New Tax Regime with standard deduction ₹75,000)
    const taxableIncome = Math.max(0, baseInr - 75000);
    let annualTax = 0;
    
    // Under New Regime: up to 7L has rebate (0 tax), above that standard slab applies
    if (taxableIncome > 700000) {
      if (taxableIncome > 1500000) {
        annualTax = 150000 + (taxableIncome - 1500000) * 0.30;
      } else if (taxableIncome > 1200000) {
        annualTax = 90000 + (taxableIncome - 1200000) * 0.20;
      } else if (taxableIncome > 1000000) {
        annualTax = 60000 + (taxableIncome - 1000000) * 0.15;
      } else if (taxableIncome > 700000) {
        annualTax = 20000 + (taxableIncome - 700000) * 0.10;
      }
      annualTax = annualTax * 1.04; // 4% Health & Education cess
    }
    
    const monthlyTds = Math.round(annualTax / 12);
    const monthlyInHand = Math.max(0, Math.round(monthlyGross - employeePfMonthly - professionalTaxMonthly - monthlyTds));
    
    // First year one-time cash (joining bonus after 30% tax)
    const firstYearBonusPostTax = Math.round(joiningBonus * 100000 * 0.70);
    const annualTakeHome = monthlyInHand * 12;
    const firstYearTotalCash = annualTakeHome + firstYearBonusPostTax;

    return {
      monthlyInHand,
      monthlyGross: Math.round(monthlyGross),
      monthlyTds,
      employeePfMonthly: Math.round(employeePfMonthly),
      professionalTaxMonthly,
      annualTakeHome,
      firstYearTotalCash,
      firstYearBonusPostTax,
      annualTax: Math.round(annualTax),
      stocksPerYear: Math.round((stocksFourYears * 100000) / 4),
    };
  }, [basePay, joiningBonus, stocksFourYears]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          B.Tech Placement CTC & In-Hand Salary Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          De-mystifying the gap between campus offer letter CTC numbers and actual monthly bank credit in India.
        </p>
      </div>

      {/* Real Company Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 block">
          Load Real Campus Offer Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-lg text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>{preset.name}</span>
              <span className="text-blue-400 font-mono text-[11px] tabular-nums">({preset.ctc} LPA)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 text-xs text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Offer Letter Compensation Components</h3>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              Total CTC: <strong>₹{ctc.toFixed(1)} LPA</strong>
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Total CTC */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Total CTC Stated in Offer</label>
                <span className="font-mono text-white text-sm font-bold tabular-nums">₹{ctc.toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="60.0"
                step="0.5"
                value={ctc}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCtc(val);
                  setBasePay(parseFloat((val * 0.65).toFixed(1)));
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Annual Base Salary */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <label className="text-slate-300 font-semibold">Annual Fixed Base Pay (Guaranteed Cash)</label>
                  <span className="text-[10px] text-slate-500">(Basic + HRA + Allowances)</span>
                </div>
                <span className="font-mono text-emerald-400 text-sm font-bold tabular-nums">₹{basePay.toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="2.5"
                max={Math.max(3.0, ctc)}
                step="0.2"
                value={basePay}
                onChange={(e) => setBasePay(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                This is the actual recurring money from which your monthly pay is calculated.
              </p>
            </div>

            {/* Joining Bonus */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <label className="text-slate-300 font-semibold">1st Year Joining Bonus / Sign-on</label>
                  <span className="text-[10px] text-slate-500">(One-time payout)</span>
                </div>
                <span className="font-mono text-blue-400 font-bold tabular-nums">₹{joiningBonus.toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="0"
                max="15.0"
                step="0.5"
                value={joiningBonus}
                onChange={(e) => setJoiningBonus(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Stocks / RSUs */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <label className="text-slate-300 font-semibold">Stocks / RSUs / ESOPs (4-Year Vesting)</label>
                  <span className="text-[10px] text-slate-500">(Amazon, Google, Atlassian)</span>
                </div>
                <span className="font-mono text-amber-400 font-bold tabular-nums">₹{stocksFourYears.toFixed(1)} LPA Total</span>
              </div>
              <input
                type="range"
                min="0"
                max="30.0"
                step="0.5"
                value={stocksFourYears}
                onChange={(e) => setStocksFourYears(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                Vested 25% each year. Yearly value: ~₹{(stocksFourYears / 4).toFixed(1)} LPA. Not monthly cash!
              </p>
            </div>

            {/* Variable / Performance Pay */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Annual Performance / Variable Bonus</label>
                <span className="font-mono text-purple-400 font-bold tabular-nums">₹{variablePay.toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="0"
                max="10.0"
                step="0.5"
                value={variablePay}
                onChange={(e) => setVariablePay(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paid out once a year based on company and individual appraisal rating.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Companies inflate CTC numbers on campus by adding 4 years of stocks, gratuity, life insurance premiums, 
              and food coupons into a single 1-year headline figure. Base Pay is what determines your real living budget!
            </p>
          </div>
        </div>

        {/* Right: Take-Home Breakdown Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main In-Hand Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-900/50 rounded-2xl p-6 text-slate-200 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Real Monthly In-Hand Cash</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Bank Credit</span>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                ₹{breakdown.monthlyInHand.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-400"> / month</span>
              </div>
              <span className="text-xs text-emerald-400/90 font-medium block mt-1">
                Net credited to your salary account on 30th/31st of every month
              </span>
            </div>

            {/* Monthly Deductions Breakdown */}
            <div className="space-y-2 py-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Monthly Gross Salary</span>
                <span className="font-mono text-white tabular-nums">₹{breakdown.monthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Employee PF (Provident Fund)</span>
                <span className="font-mono text-rose-400 tabular-nums">- ₹{breakdown.employeePfMonthly.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Income Tax (TDS Estimate)</span>
                <span className="font-mono text-rose-400 tabular-nums">- ₹{breakdown.monthlyTds.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Professional Tax (PT)</span>
                <span className="font-mono text-rose-400 tabular-nums">- ₹{breakdown.professionalTaxMonthly}</span>
              </div>
            </div>

            {/* First Year Cash Summary */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">12-Month In-Hand Total:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  ₹{(breakdown.annualTakeHome / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              {joiningBonus > 0 && (
                <div className="flex justify-between text-blue-300">
                  <span>+ Sign-on Bonus (Net Post-Tax):</span>
                  <span className="font-mono font-bold tabular-nums">
                    + ₹{(breakdown.firstYearBonusPostTax / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              )}
              <div className="flex justify-between text-emerald-400 pt-1 font-semibold border-t border-slate-800/80">
                <span>Total 1st Year Cash Inflow:</span>
                <span className="font-mono text-sm tabular-nums">
                  ₹{(breakdown.firstYearTotalCash / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Reality Check Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Placement Salary Rules of Thumb:</span>
            </h4>
            <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
              <li>If CTC is ≤ 7.5 LPA, Income Tax under the New Tax Regime is practically ZERO due to Section 87A rebate!</li>
              <li>Stocks/RSUs vest gradually (e.g. 25% after 1 year). If you leave before 12 months, you forfeit them.</li>
              <li>Joining bonuses usually carry a 1-year clawback agreement if you resign early.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
