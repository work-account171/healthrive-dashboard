// Enhanced TableShimmer.tsx
import React from "react";

const TableShimmer: React.FC = () => {
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, index) => (
        <tr
          key={index}
          className="hover:bg-gray-50 text-[16px] transition duration-150"
        >
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-2/3"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-1/2"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-3 items-center justify-center">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableShimmer;