import { ListCheck } from "lucide-react"

type TaskCardProps={
    text:string,
    number:number,
    bgColor:string,
    textColor:string,
    borderColor:string

}

const TaskCard: React.FC<TaskCardProps>=({text,number,bgColor,textColor,borderColor})=> {
  return (
    <>
    <div className={`${bgColor} ${borderColor} w-full flex-col gap-5 flex p-[18px] rounded-xl border`}>
            <div className="flex justify-start items-start gap-3">
              <ListCheck/>
              <p className="text-xl">{text}</p>
            </div>
            <h1 className={`text-4xl  font-bold ${textColor}`}>{number}</h1>
          </div>
    
    </>
  )
}

export default TaskCard