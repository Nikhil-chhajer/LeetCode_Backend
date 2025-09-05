const bashconfig=['/bin/bash','-c',]
// '/bin/bash make sure terminal is runned and '-c' flag make sure that following string will be run as command 
export const commands={
    python:function(code:string,input?:string){
        const runCommand=`echo '${code}'>code.py && echo '${input}'>input.txt  && python3 code.py < input.txt`
        return [...bashconfig,runCommand];
    },
    cpp:function(code:string,input?:string){
        const runCommand=`mkdir app && cd app && echo '${code}'>code.cpp && echo '${input}'>input.txt  && g++ code.cpp -o run && ./run< input.txt`
        return [...bashconfig,runCommand];
    }
}