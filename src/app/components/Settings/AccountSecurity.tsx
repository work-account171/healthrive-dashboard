"use client";

export default function ProfileSection() {
  return (
   
    <div className="p-6 border border-gray-200 rounded-xl w-full">
      <h2 className="text-[20px] font-medium pb-[40px]">
        Account & Security Settings
      </h2>

      <h2 className="text-[20px] font-semibold mb-4  h-fit">
        Profile Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-[16px] font-medium mb-2">Display Name *</label>
          <input
            type="text"
            value="Dr. Chioma"
            readOnly
            className="bg-gray-100 px-4 py-3 rounded-lg text-gray-700 font-medium"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[16px] font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value="Chioma@clinic.com"
            readOnly
            className="bg-gray-100 px-4 py-3 rounded-lg text-gray-700 font-medium"
          />
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <h2 className="text-[20px] font-semibold mb-4 font-outfit">Security</h2>

      <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-blue-50 transition-all">
        <span className="text-sm">|**</span>
        Change Password
      </button>
    </div>

  );
}
