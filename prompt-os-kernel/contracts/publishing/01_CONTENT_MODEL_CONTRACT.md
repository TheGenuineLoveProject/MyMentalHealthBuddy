# CONTENT_MODEL_CONTRACT
Version: 1.1.0
Status: CANONICAL
Domain: PLATFORM_DOMAIN
Contract ID: publishing.content_model.v1

## PURPOSE
Define the single canonical content entity used across publishing, SEO, blog, newsletter, social distribution, and audit logging.

## PRIMARY LAW
Strict separation:
- BUSINESS / PLATFORM content ≠ HEALING content
- No emotional state, therapy data, crisis flows, or monetization logic inside HEALING content

## CANONICAL ENTITY

### Required Fields
id (UUID v4)
title (5–200 chars)
slug (canonical, unique)
summary (20–300 chars)
body (markdown | sanitized HTML | structured)
status (enum)
author (user id)
domain (enum)
updatedAt (ISO datetime)
visibility (enum)
audit (object)

### Optional Fields
tags (max 10)
category (required before publish)
seo (required before approved)
publishAt (ISO datetime, required if scheduled)
canonicalUrl (required before published)
distribution (object)

## STATUS ENUM
idea, draft, review, approved, scheduled, published, archived

## DOMAIN ENUM
HEALING_DOMAIN, BUSINESS_DOMAIN, PLATFORM_DOMAIN, DESIGN_DOMAIN, RESEARCH_DOMAIN

## VISIBILITY ENUM
public, subscribers, plan_gated, internal

## VALIDATION RULES
- All required fields present
- Slug canonical and unique
- SEO valid before approval
- canonicalUrl present before publish
- Audit object required
- Status transitions must follow B3

## DOMAIN SAFETY RULES
1. HEALING_DOMAIN:
   - No monetization CTAs
   - No pricing or conversion links

2. BUSINESS_DOMAIN:
   - Must not appear inside healing flows

3. SEO:
   - No manipulation or false clinical authority

## DEPENDENCIES
B2, B3, B4, B7, B8, B9, B10

## CHANGE CONTROL
- Increment version on change
- Avoid breaking changes without migration
