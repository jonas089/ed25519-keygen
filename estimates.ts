const { Keys } = require("casper-js-sdk");
// estimate how many attempts are needed to produce a pubkey with suffix
export function estimateAttempts(suffix: string){
    const charSetSize: number = 16;
    const length: number = suffix.length;
    let prob: number = 1/charSetSize;
    for (let i: number = 1; i < suffix.length; i ++){
        prob *= 1/charSetSize;
    }
    return 1/prob
}

// estimate time for generating N keys
export function estimateTime(attempts: number, suffix: string){
    const start_time: number = Date.now();
    for (let i: number = 0; i < attempts; i++){
        const k: any = Keys.Ed25519.new();
        const x: string = k.publicKey.toHex().endsWith(suffix);
    }
    let elapsed_time: number = Date.now() - start_time;
    return elapsed_time
}

// estimate time for generating one key
export function estimateTimeSingle(attempts: number, suffix:string){
    let total_time: number = estimateTime(attempts, suffix);
    return total_time / attempts;
}

// estimation entry point
export function estimate(attempts: number, suffix: string){
    const _estimateAttempts: any = estimateAttempts(suffix);
    const _estimateTime: number = estimateTimeSingle(attempts, suffix);
    const _expectedRuntime: number = _estimateTime * _estimateAttempts;
    return {
        "time": _expectedRuntime,
        "attempts": _estimateAttempts
    };
}