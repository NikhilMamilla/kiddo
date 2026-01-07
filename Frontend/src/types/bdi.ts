export type DistressLevel = 'Low' | 'Moderate' | 'High';

export interface BDIResult {
    bdiScore: number;
    distressLevel: DistressLevel;
    shutdownDetected?: boolean;
}
