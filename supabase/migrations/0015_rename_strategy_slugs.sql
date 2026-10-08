-- Add subscribable flag
alter table public.strategies
  add column if not exists is_subscribable boolean not null default true;

-- Rename strategies + update benchmarks + set subscribable
update public.strategies
   set name = 'Multicap Select',
       slug = 'multicap-select',
       benchmark = 'NIFTY 500',
       short_description = 'Systematic strategies across India''s full market-cap spectrum.'
 where slug = 'momentum-eq';

update public.strategies
   set name = 'Broad Market Select',
       slug = 'broad-market-select',
       benchmark = 'NIFTY 500',
       is_subscribable = false,
       short_description = 'Systematic strategies across India''s full market-cap spectrum.'
 where slug = 'momentum-broad';

update public.strategies
   set name = 'Smallcap Select',
       slug = 'smallcap-select',
       benchmark = 'NIFTY Smallcap 100',
       short_description = 'Systematic strategies across India''s small-cap universe.'
 where slug = 'smallcap-ensemble';

update public.strategies
   set name = 'Midcap Select',
       slug = 'midcap-select',
       benchmark = 'NIFTY Midcap 100',
       short_description = 'Systematic strategies across India''s mid-cap universe.'
 where slug = 'midcap';