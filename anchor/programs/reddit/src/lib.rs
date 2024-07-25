use anchor_lang::prelude::*;

declare_id!("DDJ6SXRJSnWamYPFuHaMaUDhUEfN5D2ztiFCxLKcbb9k");

#[program]
pub mod reddit {
    use super::*;

  pub fn create_reddit_post(
    ctx: Context<CreatePost>, 
    topic: String, 
    content: String,
  ) -> Result<()> {  
    let reddit_post = &mut ctx.accounts.reddit_post;
    let clock: Clock = Clock::get().unwrap();
    reddit_post.author = ctx.accounts.author.key();
    reddit_post.topic = topic;
    reddit_post.content = content;
    reddit_post.timestamp = clock.unix_timestamp;

    Ok(())
  }  

  pub fn update_reddit_post(
    ctx: Context<UpdatePost>,
    _topic: String,
    new_content: String,
  ) -> Result<()> {  
    

    let reddit_post = &mut ctx.accounts.reddit_post;
    reddit_post.content = new_content;
    Ok(())
  }

  pub fn delete_reddit_post(
    _ctx: Context<DeletePost>,
    _title: String,
  ) -> Result<()> {
      Ok(())
  } 
  
}  

// 1. Define the structure of the Reddit account.
#[account]
pub struct RedditPostState {
    pub author: Pubkey,
    pub topic: String,
    pub content: String,
    pub timestamp: i64,
}

#[derive(Accounts)]
#[instruction(topic:String, content:String)]
pub struct CreatePost<'info> {
  #[account(
    init, 
    seeds = [topic.as_bytes(), author.key().as_ref()],
    bump,
    payer = author, 
    space = 8 + 32 + 8+ 4 + topic.len() + 4 + content.len(),
  )]
  pub reddit_post: Account<'info, RedditPostState>,
  #[account(mut)]
  pub author: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(topic:String, content:String)]
pub struct UpdatePost<'info> {
  #[account(
    mut, 
    seeds = [topic.as_bytes(), author.key().as_ref()],
    bump,
    realloc = 8 + 32 + 8 + 4 + topic.len() + 4 + content.len(),
    realloc::payer = author, 
    realloc::zero = true,
  )]
  pub reddit_post: Account<'info, RedditPostState>,
  #[account(mut)]
  pub author: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(topic:String)]
pub struct DeletePost<'info> {
  #[account(
    mut, 
    seeds = [topic.as_bytes(), author.key().as_ref()],
    bump,
    close = author, 
  )]
  pub reddit_post: Account<'info, RedditPostState>,
  #[account(mut)]
  pub author: Signer<'info>,
  pub system_program: Program<'info, System>,
}

