const bashconfig=['/bin/bash','-c',]
// '/bin/bash make sure terminal is runned and '-c' flag make sure that following string will be run as command 
export const commands={
    python:function(code:string){
        const runCommand=`echo '${code}'>code.py && python3 code.py`
        return [...bashconfig,runCommand];
    },
    cpp:function(code:string){
        const runCommand=`mkdir app && cd app && echo '${code}'>code.cpp && g++ code.cpp -o run && ./run`
        return [...bashconfig,runCommand];
    }
}