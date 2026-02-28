/**
 * ARMeasureModule.m
 * React Native Bridge for the Swift ARKit measurement module
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ARMeasureModule, RCTEventEmitter)

RCT_EXTERN_METHOD(checkSupport:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startSession:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopSession)

RCT_EXTERN_METHOD(placeMeasurePoint:(float)screenX
                  screenY:(float)screenY
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(resetMeasurement)
RCT_EXTERN_METHOD(resetAll)

@end
