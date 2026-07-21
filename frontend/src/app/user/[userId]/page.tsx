'use client';

import { useParams } from 'next/navigation';
import useUser from '@/util/query-hooks/useUser';
import useUserPosts from '@/util/query-hooks/useUserPosts';
import PostItem from '@/components/postitem/PostItem';
import { getMediaUrl } from '@/util/mediaUrl';
import styles from './userpage.module.css';

export default function UserPage() {
    const params = useParams();
    const userId = Number(params.userId);

    const { 
        data: user, 
        isLoading: isUserLoading, 
        isError: isUserError, 
        error: userError 
    } = useUser(userId);

    const { 
        data: postsData, 
        isLoading: isPostsLoading, 
        isError: isPostsError, 
        error: postsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useUserPosts(userId);

    if (isUserLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.status}>
                    <div className={styles.spinner}></div>
                    <p>Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (isUserError || !user) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>
                    <h3>User Not Found</h3>
                    <p>{userError?.message || "Failed to load user profile."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* ── User Header ── */}
            <div className={styles.header}>
                {user.image_path ? (
                    <img 
                        src={getMediaUrl(user.image_path)} 
                        alt={`${user.username}'s profile`}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={styles.avatarFallback}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className={styles.info}>
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
                </div>
            </div>

            {/* ── User Posts ── */}
            <h2 className={styles.sectionTitle}>Posts by {user.username}</h2>
            
            {isPostsLoading ? (
                <div className={styles.status}>
                    <div className={styles.spinner}></div>
                    <p>Loading posts...</p>
                </div>
            ) : isPostsError ? (
                <div className={styles.error}>
                    <h3>Something went wrong</h3>
                    <p>{postsError?.message || "Failed to fetch posts. Please try again later."}</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {postsData?.pages.map((page, i) => (
                        <div key={i}>
                            {page.posts.map((post) => (
                                <PostItem key={post.id} post={post} />
                            ))}
                        </div>
                    ))}
                    
                    {postsData?.pages[0].posts.length === 0 && (
                        <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem 0' }}>
                            This user hasn't created any posts yet.
                        </p>
                    )}

                    {hasNextPage && (
                        <div className={styles.loadMoreContainer}>
                            <button 
                                className={styles.loadMoreBtn}
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
