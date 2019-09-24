import * as CryptoJS from 'crypto-js'; 

class Block {
    static calculateBlockHash = (
        index: number, 
        previousHash: string, 
        data: string, 
        timestamp: number
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block): boolean => 
        typeof aBlock.index === "number" && 
        typeof aBlock.hash === "string" && 
        typeof aBlock.previousHash === "string" && 
        typeof aBlock.data ==="string" && 
        typeof aBlock.timestamp === "number";

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;
    
    constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "2020202020", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = () : Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string) : Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, data, nextTimestamp);
    const newBlock: Block = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimestamp);
    addBlock(newBlock);
    return newBlock;
}

const getHashforBlock = (aBlock: Block) : string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.data, aBlock.timestamp);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
}

const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

// console.log(createNewBlock("hello"), "\n");
// console.log(createNewBlock("byebye"), "\n");
// console.log(blockchain);

createNewBlock("second block");
createNewBlock("thrid block");
createNewBlock("fourth block");

console.log(blockchain);

export {};