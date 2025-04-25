import { CreditCard } from "lucide-react";

type PaymentMethodsProps = {
  paymentMethodsProp: string | string[];
};

const PaymentMethods = ({ paymentMethodsProp } : PaymentMethodsProps ) => {
  const paymentMethods = typeof paymentMethodsProp === 'string' ? JSON.parse(paymentMethodsProp) : paymentMethodsProp; 

  return (
    <div>
      {paymentMethods?.map((method : string, index : number) => (
        <div key={index} className="flex items-center gap-2">
          <CreditCard size={18} className="text-[#0a8a8a]" />
          <span>{method}</span>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
