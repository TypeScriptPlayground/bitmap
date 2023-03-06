interface HeaderType {
    size : number,
    name : string
}

const headerType : HeaderType[] = [
    {
        size: 12,
        name: 'BITMAPCOREHEADER'
    },
    {
        size: 16,
        name: 'OS22XBITMAPHEADER'
    },
    {
        size: 40,
        name: 'BITMAPINFOHEADER'
    },
    {
        size: 52,
        name: 'BITMAPV2INFOHEADER'
    },
    {
        size: 56,
        name: 'BITMAPV3INFOHEADER'
    },
    {
        size: 64,
        name: 'OS22XBITMAPHEADER'
    },
    {
        size: 108,
        name: 'BITMAPV4HEADER'
    },
    {
        size: 124,
        name: 'BITMAPV5HEADER'
    }
];

const decoder = new TextDecoder();

function uInt8ArrayToNumber( array : Uint8Array ) : number {
    let currentPower = 1;
    return array.reduce( ( previousValue, currentValue ) => {
        previousValue += currentValue * currentPower;
        currentPower *= 256;
        return previousValue;
    }, 0 );

}


export class Bitmap {
    private bitmap : Uint8Array;

    constructor( bitmap : Uint8Array ) {
        this.bitmap = bitmap;
    }

    public get bitmapData() : Uint8Array {
        return this.bitmap;
    }

    public get signature() : string {
        return decoder.decode( this.bitmap.subarray( 0, 2 ) );
    }
    
    public get fileSize() : number {
        return this.bitmap.subarray( 2, 6 ).buffer.byteLength;
    }

    public get reserved() : number {
        return 0;
    }

    public get dataOffset() : number {
        return uInt8ArrayToNumber( this.bitmap.subarray( 10, 14 ) );
    }

    public get size() : HeaderType | undefined {
        return headerType.find( o => o.size === uInt8ArrayToNumber( this.bitmap.subarray( 14, 18 ) ) );
    }

    public get width() : number {
        return uInt8ArrayToNumber( this.bitmap.subarray( 18, 22 ) );
    }

    public get height() : number {
        return uInt8ArrayToNumber( this.bitmap.subarray( 22, 26 ) );
    }

    public get colorPlanes() : number {
        return uInt8ArrayToNumber( this.bitmap.subarray( 26, 28 ) );
    }

    public get bitsPerPixel() : number {
        return uInt8ArrayToNumber( this.bitmap.subarray( 28, 30 ) );
    }
    
}
