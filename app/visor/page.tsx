"use client"


export default function Visor(){
    return(
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <a href="/">Inici</a>

            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start py-16 px-16 bg-white dark:bg-black sm:items-start">
                <h2>No s'ha sel·leccionat cap cançó.</h2>
            </main>
        </div>)
    
}