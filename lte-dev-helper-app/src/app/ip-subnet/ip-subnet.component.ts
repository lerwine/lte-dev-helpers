import { Component } from '@angular/core';

interface ISubnetBlock {
  firstIP: string;
  maskBits: bigint;
  lastIP: string;
  subnetMask: string;
  addressCount: bigint;
  previousBlock?: string;
  nextBlock?: string;
}

function toIPString(value: bigint): string {
  return ((value >> 24n) & 255n) + "." + ((value >> 16n) & 255n) + "." + ((value >> 8n) & 255n) + "." + (value & 255n);
}

function fromIPString(value: string): bigint | undefined {
  var segments: string[] = value.split('.');
  if (segments.length != 4) return;
  var n = parseInt(segments[0]);
  if (isNaN(n) || n < 0 || n > 255) return;
  var r = BigInt(n);
  for (var i = 1; i < 4; i++) {
    n = parseInt(segments[i]);
    if (isNaN(n) || n < 0 || n > 255) return;
    r = (r << 8n) | BigInt(n);
  }
  return r;
}

@Component({
  selector: 'app-ip-subnet',
  templateUrl: './ip-subnet.component.html',
  styleUrls: ['./ip-subnet.component.css']
})
export class IpSubnetComponent {
  targetAddress: string = "10.0.0.0";
  
  previousAddress: string | undefined;

  blocks: ISubnetBlock[] = [];

  errorMessage: string | undefined;

  calculate(): void {
    var targetValue: bigint | undefined = fromIPString(this.targetAddress);
    this.blocks = [];
    if (typeof targetValue === "undefined") {
      this.errorMessage = "Invalid IP Address";
      this.previousAddress = undefined;
      return;
    }
    this.errorMessage = undefined;
    if (targetValue > 0n)
      this.previousAddress = toIPString(targetValue - 1n);
    else
      this.previousAddress = undefined;
    for (var maskBits = 32n; maskBits >= 0n; maskBits--) {
      var subNetMask: bigint = 4294967295n << (32n - maskBits);
      var firstIP: bigint = targetValue & subNetMask;
      var lastIP: bigint = firstIP | (4294967295n >> maskBits);
      var b: ISubnetBlock = { firstIP: toIPString(firstIP), maskBits: maskBits, lastIP: toIPString(lastIP), subnetMask: toIPString(subNetMask), addressCount: (lastIP - firstIP) + 1n };
      var block: bigint, bl: bigint;
      if (firstIP > 0n) {
        block = (firstIP - 1n) & subNetMask;
        bl = block | (4294967295n >> maskBits);
        if (bl < firstIP)
          b.previousBlock = toIPString(block);
      }

      if (lastIP < 4294967295n) {
        block = (lastIP + 1n) & subNetMask;
        if (block > lastIP)
          b.nextBlock = toIPString(block);
      }
      this.blocks.push(b);
    }
  }

  setAddress(address: string) {
    this.targetAddress = address;
    this.calculate();
  }

  constructor() {
    this.calculate();
  }
}
