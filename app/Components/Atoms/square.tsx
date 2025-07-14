'use Client'
import React from "react";

type SquareProps ={
  value: string;
  onClick: () => void;
}

export default function SquareProps({value, onClick }: SquareProps) {
  return (
    <button 
    className="w-[80px] h-[80px] text-[32px] font-bold cursor-pointer "
    style={{
      border: '1px solid #fff',
    }}
    onClick={onClick}   
    >
      {value}
    </button>
  )
}

