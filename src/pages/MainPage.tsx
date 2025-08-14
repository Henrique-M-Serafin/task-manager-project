import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Task, TaskStatus } from "@/types";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";

export function MainPage() {
  const { tasks, addTask, deleteTask, updateTaskStatus } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    createdAt: new Date(),
    status: 'pending'
    })

  const { completed, percent } = calculateCompletedTasks(tasks);  

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    try{
      setLoading(true)
      addTask(formData.title, formData.description)
      setDialogOpen(false)
    }catch(err){    
      console.log('Error! Task not created!')
    } finally{
      setLoading(false)
    }
  }

  function toggleStatus(index: number) {
    const task = tasks[index]
    let newStatus: TaskStatus;
    switch (task.status) {
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      default:
        newStatus = 'pending';
    }
    updateTaskStatus(index, newStatus);
  }
        
  function calculateCompletedTasks(tasks: Task[]){
    const completedTasks = tasks.filter((t) => t.status === "completed")
    const percentTasks = tasks.length > 0 ? 100*(completedTasks.length / tasks.length) : 0
    return {
        completed: completedTasks.length,
        percent: percentTasks
      }
  }

  return (
    <div className="">
    <Dialog 
      open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-[var(--gray-6)] border-none">
        <DialogHeader>
          <DialogTitle className="text-[var(--gray-1)]">Add New Task</DialogTitle>
          <DialogDescription className="text-[var(--gray-2)]">
            Fill in the details of your new task below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev, 
                title: e.target.value
              }))
            }}
            placeholder="Task Title"
            className="p-2 border-none rounded-md bg-[var(--gray-1)]"
          />
          <textarea
            required
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))
            }}
            placeholder="Task Description"
            className="p-2 border-none rounded-md bg-[var(--gray-1)]"
          />
          <div className="flex justify-between items-center">
            <Button
              disabled={loading}
              type="submit"
              className="bg-[var(--purple-4)] text-[var(--gray-1)] hover:bg-[var(--purple-5)]"
            >
              Add Task
            </Button>
            <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-[var(--gray-4)] text-[var(--gray-1)] hover:bg-[var(--gray-5)]">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
        </form>
        
      </DialogContent>
    </Dialog>
    <div className="flex flex-col min-h-screen">
      <nav className="flex py-4 justify-evenly items-center bg-[var(--gray-6)] text-white">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-[var(--purple-4)] hover:bg-[var(--purple-5)] text-white font-bold py-3 px-6 rounded-lg">
            Add Task
          </Button>
      </nav>
      <div className="flex gap-3 justify-center items-center p-4">
        <p className="font-semibold">Tasks</p>
        <Progress className="w-[50%]" value={percent}/>
          <p className="font-semibold">{completed}/{tasks.length} Completed</p>
      </div>
    {tasks.length > 0 ? (
    <main className="flex-1 flex p-3 gap-2 flex-col items-center lg:justify-center lg:items-start lg:flex-row bg-gray-100 w-full overflow-auto">

      {/* lg:flex-1 lg:flex-row p-3 gap-3 justify-center */}
      <Card className="w-full mb-2 max-w-md p-6 bg-[var(--purple-2)] border-none">
        <CardTitle className="text-4xl font-bold text-gray-700 bg-[var(--purple-1)] shadow-lg rounded-xl py-2 flex items-center justify-center">To Do</CardTitle>
        {/* <CardDescription className="text-sm text-gray-600">
        </CardDescription> */}
        <CardContent className="">
          {tasks.map((task, index) => (
            task.status === 'pending' && (
              <Card key={index} className="mb-3 border-none shadow-lg bg-[var(--purple-3)]">
              <CardTitle className="text-lg font-semibold flex justify-center"> {task.title}</CardTitle>
              <CardDescription className="hidden lg:flex text-sm text-[var(--gray-1)] justify-center">{task.createdAt.toLocaleDateString()} - {task.createdAt.toLocaleTimeString()}</CardDescription>
              <CardContent className="text-sm text-[var(--gray-1)] flex justify-center">{task.description}</CardContent>
              <CardFooter className="flex justify-center gap-2 w-full">
                <Button className="border-[var(--purple-5)] bg-[var(--purple-4)] text-[var(--gray-1)] hover:bg-[var(--purple-5)] hover:text-[var(--gray-2)] hover:shadow-lg"
                  onClick={() =>{
                    toggleStatus(index);}}
                variant="outline">Start Doing</Button>
                <Button className="border-none bg-[var(--purple-6)] text-[var(--gray-1)] hover:bg-[var(--purple-5)] hover:text-[var(--gray-2)] hover:shadow-lg"
                  onClick={() => {
                    deleteTask(index)
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
            )
          ))}
        </CardContent>
      </Card>
      
      <Card className="w-full mb-2 max-w-md p-6 bg-[var(--yellow-2)] border-none">
        <CardTitle className="text-4xl font-bold text-gray-700 bg-[var(--yellow-1)] shadow-lg rounded-xl py-2 flex items-center justify-center">Doing</CardTitle>
        <CardContent className="">
          {tasks.map((task, index) => (
            task.status === 'in-progress' && (
            <Card key={index} className="mb-3 border-none shadow-lg bg-[var(--yellow-3)]" >
              <CardTitle className="text-lg font-semibold flex justify-center">{task.title}</CardTitle>
              <CardDescription className="text-sm text-[var(--gray-1)] hidden lg:flex justify-center">{task.createdAt.toLocaleDateString()} - {task.createdAt.toLocaleTimeString()}</CardDescription>
              <CardContent className="text-sm text-[var(--gray-1)] flex justify-center">{task.description}</CardContent>
              <CardFooter className="flex gap-2 justify-center">
                <Button className="border-[var(--yellow-5)] bg-[var(--yellow-4)] text-[var(--gray-1)] hover:bg-[var(--yellow-5)] hover:text-[var(--gray-2)] hover:shadow-lg"
                onClick={() =>{
                    toggleStatus(index);}}
                variant="outline">Complete</Button>
                <Button className="border-none bg-[var(--yellow-6)] text-[var(--gray-1)] hover:bg-[var(--yellow-5)] hover:text-[var(--gray-2)] hover:shadow-lg"
                  onClick={() => {
                    deleteTask(index)
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
            )
          ))}
        </CardContent> 
      </Card>
      <Card className="w-full mb-2 max-w-md p-6 bg-[var(--green-2)] border-none">
        <CardTitle className="text-4xl font-bold text-gray-700 bg-[var(--green-1)] shadow-lg rounded-xl py-2 flex items-center justify-center">Done</CardTitle>
        <CardContent className="">
          {tasks.map((task, index) => (
            task.status === 'completed' && (
            <Card key={index} className="mb-3 border-none shadow-lg bg-[var(--green-3)]">
              <CardTitle className="text-lg font-semibold flex justify-center">{task.title}</CardTitle>
              <CardDescription className="text-sm text-[var(--gray-1)] hidden lg:flex justify-center">{task.createdAt.toLocaleDateString()} - {task.createdAt.toLocaleTimeString()}</CardDescription>
              <CardContent className="text-sm text-[var(--gray-1)] flex justify-center">{task.description}</CardContent>
              <CardFooter className="flex gap-2 justify-center">
                
                <Button className=" border-none bg-[var(--green-5)] text-[var(--gray-1)] hover:bg-[var(--green-6)] hover:text-[var(--gray-2)] hover:shadow-lg"
                  onClick={() =>{
                    toggleStatus(index);}}
                    variant="outline" disabled >
                      Completed
                  </Button>
                <Button className="border-none bg-[var(--green-5)] text-[var(--gray-1)] hover:bg-[var(--green-6)] hover:text-[var(--gray-2)] hover:shadow-lg"
                  onClick={() => {
                    deleteTask(index)
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
            )
          ))}
        </CardContent>
      </Card>
    </main>
    ) : (
      <div className="flex-1 flex p-3 gap-3 justify-center items-center bg-gray-100 w-full overflow-auto">
        <div className="flex flex-col">
          <h2 className="font-bold">Please add Tasks to start using the App</h2>
          <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-[var(--purple-4)] hover:bg-[var(--purple-5)] text-white font-bold py-3 px-6 rounded-lg">
              Add Task
          </Button>
        </div>
      </div>
    )}
    <footer className="flex py-3 justify-center items-center bg-[var(--gray-6)] text-white">
        <p className="text-sm"> 2025. Projeto realizado para fins educacionais.</p>
    </footer>
  </div>
  </div>
  );

}