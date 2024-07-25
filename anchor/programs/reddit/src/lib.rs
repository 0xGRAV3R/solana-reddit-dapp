#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("DDJ6SXRJSnWamYPFuHaMaUDhUEfN5D2ztiFCxLKcbb9k");

#[program]
pub mod reddit {
    use super::*;

  pub fn close(_ctx: Context<CloseReddit>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.reddit.count = ctx.accounts.reddit.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.reddit.count = ctx.accounts.reddit.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeReddit>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.reddit.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeReddit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Reddit::INIT_SPACE,
  payer = payer
  )]
  pub reddit: Account<'info, Reddit>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseReddit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub reddit: Account<'info, Reddit>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub reddit: Account<'info, Reddit>,
}

#[account]
#[derive(InitSpace)]
pub struct Reddit {
  count: u8,
}
