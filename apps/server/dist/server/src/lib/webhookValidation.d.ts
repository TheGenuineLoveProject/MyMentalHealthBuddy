/**
 * Webhook Validation - 360° Security Enhancement
 * Validates Stripe webhook signatures for security
 */
import type { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
/**
 * Stripe webhook signature validation middleware
 * Ensures webhooks are actually from Stripe
 */
export declare function validateStripeWebhook(stripe: Stripe): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function ensureWebhookIdempotency(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Webhook event type validation
 * Ensures we only process expected event types
 */
export declare function validateWebhookEventType(allowedTypes: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
